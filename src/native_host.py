#!/usr/bin/env python3
import sys
import json
import struct
import os
import smtplib
import urllib.request
from email.message import EmailMessage

# NATIVE MESSAGING PROTOCOL
def get_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        sys.exit(0)
    message_length = struct.unpack('@I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_message(content):
    encoded_content = json.dumps(content).encode('utf-8')
    encoded_length = struct.pack('@I', len(encoded_content))
    sys.stdout.buffer.write(encoded_length)
    sys.stdout.buffer.write(encoded_content)
    sys.stdout.buffer.flush()

def download_and_email(url, filename, sender, password, smtp_host, smtp_port, kindle_email):
    try:
        # Download PDF into memory
        headers = {'User-Agent': 'Mozilla/5.0'} 
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            pdf_data = response.read()
        
        # Create Email
        msg = EmailMessage()
        msg['Subject'] = 'New ArXiv Paper'
        msg['From'] = sender
        msg['To'] = kindle_email
        msg.set_content(f'Sent from ArXiv Auto-Downloader.\nSource: {url}')

        msg.add_attachment(pdf_data, maintype='application', subtype='pdf', filename=filename)

        # Send
        # Use provided host and port (cast port to int)
        port = int(smtp_port) if smtp_port else 465
        host = smtp_host if smtp_host else 'smtp.gmail.com'
        
        with smtplib.SMTP_SSL(host, port) as smtp:
            smtp.login(sender, password)
            smtp.send_message(msg)
            
        return True, "Success"
    except Exception as e:
        return False, str(e)

def main():
    while True:
        try:
            msg = get_message()
            if msg.get('type') == 'download_and_send':
                url = msg.get('url')
                filename = msg.get('filename')
                sender = msg.get('sender_email')
                password = msg.get('sender_password')
                smtp_host = msg.get('smtp_host')
                smtp_port = msg.get('smtp_port')
                kindle = msg.get('kindle_email')

                if not url or not sender:
                     send_message({"status": "error", "message": "Missing arguments"})
                     continue

                success, reason = download_and_email(url, filename, sender, password, smtp_host, smtp_port, kindle)

                if success:
                    send_message({"status": "success", "message": f"Downloaded & Sent {filename}"})
                else:
                    send_message({"status": "error", "message": f"Failed: {reason}"})
            else:
                 send_message({"status": "ignored", "message": "Unknown message type"})

        except Exception as e:
            sys.exit(0)

if __name__ == '__main__':
    main()
