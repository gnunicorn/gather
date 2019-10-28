#[macro_use]
extern crate lazy_static;

use lettre::stub::StubTransport;
use lettre::file::FileTransport;
use lettre::smtp::SmtpTransport;
use lettre::sendmail::SendmailTransport;
use lettre::smtp::authentication::Credentials;
use lettre::SmtpClient;
pub use lettre::{Transport, SendableEmail};

use handlebars;

mod config;
pub use crate::config::EmailConfig;
pub use lettre_email::{Email, EmailBuilder};

lazy_static! {
    pub static ref TEMPLATE_RENDERER: handlebars::Handlebars = {
        let mut h = handlebars::Handlebars::new();
        h.register_template_string("emails/html/confirm-email",
                include_str!("../../../templates/emails/html/confirm-email.hbs"));
        h.register_template_string("emails/html/rsvped",
                include_str!("../../../templates/emails/html/rsvped.hbs"));
        h.register_template_string("emails/html/new-gathering",
                include_str!("../../../templates/emails/html/new-gathering.hbs"));

        h.register_template_string("emails/titles/confirm-email",
                include_str!("../../../templates/emails/titles/confirm-email.hbs"));
        h.register_template_string("emails/titles/rsvped",
                include_str!("../../../templates/emails/titles/rsvped.hbs"));
        h.register_template_string("emails/titles/new-gathering",
                include_str!("../../../templates/emails/titles/new-gathering.hbs"));

        if let Ok(mut cur) = std::env::current_dir() {
            cur.push("templates");
            if cur.is_dir() {
                // if we have a "templates" dir in the working dir, add it
                h.register_templates_directory(".hbs", cur);
            }
        }
        h
    };
}


/// Wrapper around various lettre::Transport implementations
pub enum EmailSender {
    Stub(StubTransport, String),
    Sendmail(SendmailTransport, String),
    File(FileTransport, String),
    SMTP(SmtpTransport, String),
}

impl EmailSender {

    /// Finish the email (set `from`) and send it with the configured transport
    pub fn send(&mut self, builder: EmailBuilder) -> Result<(), String> {
        let build = |addr: &str| ->  Result<SendableEmail, String> { builder
            .from(addr)
            .build()
            .map(|e| e.into())
            .map_err(|e| format!("Building Email failed: {}", e))
        };

        match self {
            EmailSender::Stub(t, addr) => t.send(build(&addr)?).map_err(|_| unreachable!("never fails")),
            EmailSender::Sendmail(t, addr) => t.send(build(&addr)?).map_err(|e| format!("Sending mail failed: {}", e)),
            EmailSender::File(t, addr)  => t.send(build(&addr)?).map_err(|e| format!("Sending mail failed: {}", e)),
            EmailSender::SMTP(t, addr) => t.send(build(&addr)?).map(|_| ()).map_err(|e| format!("Sending mail failed: {}", e)),
        }
    }
}

pub fn make_lettre_transport<'a>(config: EmailConfig) -> Result<EmailSender, String>
{
    match config {
        EmailConfig::File { file, default_from } => Ok(
                EmailSender::File(FileTransport::new(file), default_from)),
        EmailConfig::Sendmail { default_from } => Ok(
                EmailSender::Sendmail(SendmailTransport::new(), default_from)),
        EmailConfig::SMTP { default_from, host, username, password, auth, connection_reuse, smtp_utf8 } => {
            let mut client = if let Some(hostname) = host {
                SmtpClient::new_simple(&hostname)
                    .map_err(|e| format!("Could not build SMTP client: {}", e))?
            } else {
                SmtpClient::new_unencrypted_localhost()
                    .map_err(|e| format!("Could not build SMTP client: {}", e))?
            }.smtp_utf8(smtp_utf8);

            if username.is_some() || password.is_some() {
                client = client.credentials(Credentials::new(
                    username.clone().unwrap_or_default(), password.clone().unwrap_or_default()));
            }

            if let Some(auth) = auth {
                client = client.authentication_mechanism(auth);
            }

            if let Some(connection_reuse) = connection_reuse {
                client = client.connection_reuse(connection_reuse);
            }

            Ok(EmailSender::SMTP(client.transport(), default_from))
        }
        EmailConfig::Stub { default_from } => Ok(EmailSender::Stub(StubTransport::new_positive(), default_from)),
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