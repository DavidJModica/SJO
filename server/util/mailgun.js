import mailgun from 'mailgun-js';
import config from 'config';

export function sendMessage(to, subject, text, html) {
  const apiKey = config.get('mailgun.apiKey');
  const sender = mailgun({ apiKey, domain: 'mail.salesjournalonline.com' });
  const data = {
    from: "donotreply@mail.salesjournalonline.com",
    to,
    subject,
    text,
    html
  }

  sender.messages().send(data, function(err, body) {
    if(err) {
      return err;
    } else {
      return body;
    }
  })
}
