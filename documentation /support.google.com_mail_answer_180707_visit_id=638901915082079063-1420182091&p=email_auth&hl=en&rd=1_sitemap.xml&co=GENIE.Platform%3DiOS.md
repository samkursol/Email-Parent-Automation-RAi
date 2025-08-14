---
url: "https://support.google.com/mail/answer/180707?visit_id=638901915082079063-1420182091&p=email_auth&hl=en&rd=1/sitemap.xml&co=GENIE.Platform%3DiOS"
title: "Check if your Gmail message is authenticated - iPhone & iPad - Gmail Help"
---

[Skip to main content](https://support.google.com/mail/answer/180707?visit_id=638901915082079063-1420182091&p=email_auth&hl=en&rd=1/sitemap.xml&co=GENIE.Platform%3DiOS#search-form)

# Check if your Gmail message is authenticated

If you see a question mark next to the sender's name, the message isn't authenticated. When an email isn't authenticated, that means Gmail doesn't know if the message is coming from the person who appears to be sending it. If you see this, be careful about replying or downloading any attachments.

iPhone & iPadAndroidComputer

More

## Check if a message is authenticated

**Important:** Messages that aren't authenticated aren't necessarily spam. Sometimes authentication doesn't work for real organizations who send mail to big groups, like messages sent to mailing lists.

Check Gmail messages

1. On your computer, open [Gmail](https://mail.google.com/). You can't check authentication on your iPhone or iPad.
2. Open an email.
3. Below the sender’s name, click the Down arrow ![Down arrow](https://lh3.googleusercontent.com/761l9Tdr4FKLAQCwIVVW_ALppz8oKatr-nKjOfwbeC462iImImsdRSJ8ES2D3zSsx4sB=h36).

The message is authenticated if you see:

- "Mailed by" header with the domain name, like google.com.
- "Signed by" header with the sending domain.

The message isn't authenticated if you see a question mark next to the sender's name. If you see this, be careful about replying or downloading any attachments.

Check messages in another mail client, like Outlook or Apple Mail

If you're checking your email on another email client, you can check the [message headers](https://support.google.com/mail/answer/22454).

1. Open an email message.
2. Find the "Authentication-Results" header.
3. If the message was authenticated by [SPF](https://support.google.com/a/answer/33786) or [DKIM](https://support.google.com/a/answer/174124), you'll see "spf=pass" or "dkim=pass."

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

Give feedback about this article

Choose a section to give feedback on

## Need more help?

### Try these next steps:

[Post to the help community  Get answers from community members](https://support.google.com/mail/community?hl=en&help_center_link=COODCxJAQ2hlY2sgaWYgeW91ciBHbWFpbCBtZXNzYWdlIGlzIGF1dGhlbnRpY2F0ZWQgLSBpUGhvbmUgJmFtcDsgaVBhZA)

true

12789059556942518148

true

Search Help Center

true

true

true

[Google Help](https://support.google.com/)

[Help Center](https://support.google.com/mail/?hl=en) [Community](https://support.google.com/mail/community?hl=en&help_center_link=COODCxJAQ2hlY2sgaWYgeW91ciBHbWFpbCBtZXNzYWdlIGlzIGF1dGhlbnRpY2F0ZWQgLSBpUGhvbmUgJmFtcDsgaVBhZA) [Gmail](https://mail.google.com/?hl=en)

[Privacy Policy](https://www.google.com/intl/en/privacy.html) [Terms of Service](https://www.google.com/intl/en/policies/terms/)Submit feedback

true

true

17

Search

Clear search

Close search

Main menu

Google apps

false

false

## What is the issue with this selection?

Inaccurate - doesn't match what I see in the product

Hard to understand - unclear or translation is wrong

Missing info - relevant but not comprehensive

Irrelevant - doesn’t match the title and / or my expectations

Minor errors - formatting issues, typos, and / or broken links

Other suggestions - ideas to improve the content

## Share additional info or suggestions

​

​

Do not share any personal info

Cancel

Submit

By continuing, you agree Google uses your answers, [account & system info](https://support.google.com/mail/answer/180707?visit_id=638901915082079063-1420182091&p=email_auth&hl=en&rd=1/sitemap.xml&co=GENIE.Platform%3DiOS#) to improve services, per our [Privacy](https://myaccount.google.com/privacypolicy?hl=en) & [Terms](https://policies.google.com/terms?hl=en).

false

false