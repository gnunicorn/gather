use lettre::smtp::{ConnectionReuseParameters, authentication::Mechanism};
use serde::{Serialize, Deserialize};
use std::path::PathBuf;

/// The different Email Transports supported
#[derive(Serialize, Deserialize, Clone ,Debug)]
#[serde(tag = "transport")]
pub enum EmailConfig {
    /// Stub transport, default - see https://lettre.at/sending-messages/stub.html
    #[serde(alias="stub")]
    Stub {
        default_from: String,
    },
    /// Send via local sendmail - see https://lettre.at/sending-messages/sendmail.html
    #[serde(alias="sendmail")]
    Sendmail {
        default_from: String,
    },
    /// File based "sending" - see https://lettre.at/sending-messages/file.html
    #[serde(alias="file")]
    File {
        #[serde(default = "std::env::temp_dir" )]
        file: PathBuf,
        default_from: String,
    },
    /// SMTP configuration - see https://lettre.at/sending-messages/smtp.html
    #[serde(alias="smtp")]
    SMTP {
        default_from: String,
        host: Option<String>,
        username: Option<String>,
        password: Option<String>,
        auth: Option<Mechanism>,
        connection_reuse: Option<ConnectionReuseParameters>,
        smtp_utf8: bool,
    },
}

impl std::default::Default for EmailConfig {
    fn default() -> EmailConfig {
        EmailConfig::Stub { default_from: "no-reply@gather.wtf".to_owned() }
    }
}