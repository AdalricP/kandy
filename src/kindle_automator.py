import json
import os
import time
import smtplib
from email.message import EmailMessage
import shutil

CONFIG_FILE = 'config.json'

def load_config():
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def send_email(file_path, config):
    print(f"Prepare to send {file_path}")
    msg = EmailMessage()
    msg['Subject'] = 'New ArXiv Paper'
    msg['From'] = config['sender_email']
    msg['To'] = config['kindle_email']
    msg.set_content('Here is a new ArXiv paper for you.')

    with open(file_path, 'rb') as f:
        file_data = f.read()
        file_name = os.path.basename(file_path)
    
    msg.add_attachment(file_data, maintype='application', subtype='pdf', filename=file_name)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(config['sender_email'], config['sender_password'])
            smtp.send_message(msg)
        print(f"Successfully sent {file_name}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def main():
    print("Starting Kindle Automator...")
    while True:
        try:
            config = load_config()
            watch_dir = config['downloads_path']
            sent_dir = os.path.join(watch_dir, "sent")
            
            if not os.path.exists(watch_dir):
                print(f"Waiting for directory: {watch_dir}")
                time.sleep(5)
                continue
                
            if not os.path.exists(sent_dir):
                os.makedirs(sent_dir)

            files = [f for f in os.listdir(watch_dir) if f.endswith('.pdf')]
            
            for file in files:
                full_path = os.path.join(watch_dir, file)
                # Ensure it's not currently being written to (simple check: size > 0 and stable, or just try/except)
                # Improved check: try to rename it to itself.
                
                print(f"Found new file: {file}")
                
                if send_email(full_path, config):
                    shutil.move(full_path, os.path.join(sent_dir, file))
                    print(f"Moved {file} to sent folder.")
            
            time.sleep(5)
            
        except Exception as e:
            print(f"Main loop error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
