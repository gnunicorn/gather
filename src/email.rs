use lettre::{SmtpClient, Transport};
use lettre_email::{Email, mime::TEXT_PLAIN};
use std::path::Path;

use substrate_service::Configuration;
use gather_runtime::GenesisConfig;
use lettre::stub::StubTransport;

///

pub fn make_lettre_transport<'a, 'b, C>(config: &'b Configuration<C, GenesisConfig>) -> impl Transport<'a>
{
    StubTransport::new_positive()
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