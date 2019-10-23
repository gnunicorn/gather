use lettre::{SmtpClient, Transport, SendableEmail};
use lettre_email::{Email, mime::TEXT_PLAIN};

use lettre::stub::StubTransport;
use lettre::file::FileTransport;
use lettre::smtp::SmtpTransport;
use lettre::sendmail::SendmailTransport;
use lettre::smtp::authentication::Credentials;
use crate::config::{GatherConfig, EmailConfig};

/// Wrapper around various lettre::Transport implementations
pub enum EmailSender {
    Stub(StubTransport),
    Sendmail(SendmailTransport),
    File(FileTransport),
    SMTP(SmtpTransport),
}

impl<'a> Transport<'a> for EmailSender {
    type Result = Result<(), String>;

    fn send(&mut self, email: SendableEmail) -> Self::Result {
        match self {
            EmailSender::Stub(t) => t.send(email).map_err(|_| unreachable!("never fails")),
            EmailSender::Sendmail(t) => t.send(email).map_err(|e| format!("Sending mail failed: {}", e)),
            EmailSender::File(t)  => t.send(email).map_err(|e| format!("Sending mail failed: {}", e)),
            EmailSender::SMTP(t) => t.send(email).map(|_| ()).map_err(|e| format!("Sending mail failed: {}", e)),
        }
    }
}

pub fn make_lettre_transport<'a>(config: &GatherConfig) -> Result<EmailSender, String>
{
    match &config.email {
        EmailConfig::File { file } => Ok(EmailSender::File(FileTransport::new(file.clone()))),
        EmailConfig::Sendmail => Ok(EmailSender::Sendmail(SendmailTransport::new())),
        EmailConfig::SMTP { host, username, password, auth, connection_reuse, smtp_utf8 } => {
            let mut client = if let Some(hostname) = host {
                SmtpClient::new_simple(&hostname)
                    .map_err(|e| format!("Could not build SMTP client: {}", e))?
            } else {
                SmtpClient::new_unencrypted_localhost()
                    .map_err(|e| format!("Could not build SMTP client: {}", e))?
            }.smtp_utf8(*smtp_utf8);

            if username.is_some() || password.is_some() {
                client = client.credentials(Credentials::new(
                    username.clone().unwrap_or_default(), password.clone().unwrap_or_default()));
            }

            if let Some(auth) = auth {
                client = client.authentication_mechanism(*auth);
            }

            if let Some(connection_reuse) = connection_reuse {
                client = client.connection_reuse(*connection_reuse);
            }

            Ok(EmailSender::SMTP(client.transport()))
        }
        _ => Ok(EmailSender::Stub(StubTransport::new_positive())),
    }
}

// impl Emailer {
//     pub fn from<C>(config: &Configuration<C, GenesisConfig>) -> Emailer {
//         Emailer {}
//     }
// }

// fn main() {
//     let email = Email::builder()
//         // Addresses can be specified by the tuple (email, alias)
//         .to(("user@example.org", "Firstname Lastname"))
//         // ... or by an address only
//         .from("user@example.com")
//         .subject("Hi, Hello world")
//         .text("Hello world.")
//         .attachment_from_file(Path::new("Cargo.toml"), None, &TEXT_PLAIN)
//         .unwrap()
//         .build()
//         .unwrap();

//     // Open a local connection on port 25
//     let mut mailer = SmtpClient::new_unencrypted_localhost().unwrap().transport();
//     // Send the email
//     let result = mailer.send(email.into());

//     if result.is_ok() {
//         println!("Email sent");
//     } else {
//         println!("Could not send email: {:?}", result);
//     }

//     assert!(result.is_ok());
// }