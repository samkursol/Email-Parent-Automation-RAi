---
url: "https://support.google.com/mail/answer/180707?visit_id=638901915082079063-1420182091&p=email_auth&hl=en&rd=1/sitemap.xml"
title: "Check if your Gmail message is authenticated - Android - Gmail Help"
---

[Skip to main content](https://support.google.com/mail/answer/180707?visit_id=638901915082079063-1420182091&p=email_auth&hl=en&rd=1/sitemap.xml#search-form)

# Check if your Gmail message is authenticated

If you see a question mark next to the sender's name, the message isn't authenticated. When an email isn't authenticated, that means Gmail doesn't know if the message is coming from the person who appears to be sending it. If you see this, be careful about replying or downloading any attachments.

## Check if a message is authenticated

**Important:** Messages that aren't authenticated aren't necessarily spam. Sometimes authentication doesn't work for real organizations who send mail to big groups, like messages sent to mailing lists.

Check Gmail messages

1. On your Android phone or tablet, open the Gmail app ![](https://lh3.googleusercontent.com/Fsl0wz7NUrYWKZiXeb-dk55qkUjeYUcwRZfvSK5X09a4eYHS-67Pv8PBKCgm3ayRGxF7=h36).
2. Open an email.
3. Tap **View details**![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **View security details**.
4. The message is authenticated if you see:

- "Mailed by" header with the domain name, like google.com.
- "Signed by" header with the sending domain.

The message isn't authenticated if you see a question mark next to the sender's name. If you see this, be careful about replying or downloading any attachments.

Check messages in another mail client, like Outlook

If you're checking your email on another email client, you can check the [message headers](https://support.google.com/mail/answer/22454).

Learn more about how authentication works (SPF & DKIM)

Emails can be authenticated using SPF or DKIM.

[SPF](https://support.google.com/a/answer/33786) specifies which hosts are allowed to send messages from a given domain by creating an [SPF record](https://support.google.com/a/answer/10685031).

[DKIM](https://support.google.com/a/answer/174124) allows the sender to electronically sign legitimate emails in a way that can be verified by recipients using a public-key.

[ARC](https://support.google.com/a/answer/13198639) checks the previous authentication status of forwarded messages. If a forwarded message passes SPF or DKIM authentication, but ARC shows it previously failed authentication, Gmail treats the message as unauthenticated.

[Learn more about email authentication](https://support.google.com/a/answer/10583557).

## Fix messages that aren't authenticated

A message I received wasn't authenticated

If a message you get from a trusted source isn't authenticated, contact the person or company who sent you the email. When you contact them, provide a link to this help page so they can learn how to authenticate their messages.

A message I sent from my domain wasn't authenticated

**Important:**

- Do not use the DKIM length tag (l=) in message headers. This tag makes messages vulnerable to spoofing.
- If a message you sent arrived with a question mark "?" next to your email address, the message wasn't authenticated.

Messages must be authenticated to make sure they're classified correctly. Also, unauthenticated messages are very likely to get rejected. Because spammers can also authenticate mail, authentication by itself isn't enough to guarantee your messages can be delivered.

### Fix messages that aren't authenticated

Make sure messages you sent are authenticated using DKIM (preferred) or SPF.

You can use these steps to [prevent your emails from being blocked by Gmail](https://support.google.com/mail/answer/81126):

- Use RSA keys that are at least 1024-bits long. Emails signed with less than 1024-bit keys are considered unsigned and can easily be spoofed.
- Gmail combines user reports and other signals, with authentication information, when classifying messages. Authentication is mandatory for every mail sender to ensure that your messages are correctly classified.
- Learn how to create a policy to help [control unauthenticated mail from your domain](https://support.google.com/mail/answer/2451690).

[Android](https://support.google.com/mail/answer/180707?visit_id=638901915082079063-1420182091&p=email_auth&hl=en&rd=1/sitemap.xml&co=GENIE.Platform%3DAndroid) [Computer](https://support.google.com/mail/answer/180707?visit_id=638901915082079063-1420182091&p=email_auth&hl=en&rd=1/sitemap.xml&co=GENIE.Platform%3DDesktop) [iPhone & iPad](https://support.google.com/mail/answer/180707?visit_id=638901915082079063-1420182091&p=email_auth&hl=en&rd=1/sitemap.xml&co=GENIE.Platform%3DiOS)

More

## Need more help?

### Try these next steps:

[Post to the help community  Get answers from community members](https://support.google.com/mail/community?hl=en&help_center_link=COODCxI2Q2hlY2sgaWYgeW91ciBHbWFpbCBtZXNzYWdlIGlzIGF1dGhlbnRpY2F0ZWQgLSBBbmRyb2lk)

true

Search

Clear search

Close search

Google apps

Main menu

992988414762009098

true

Search Help Center

true

true

true

true

true

17

false

false

false

false