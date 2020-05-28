
const private_key = process.env.partner_platform_notification__private_key;
export const configuration: any = {
    type: process.env.partner_platform_notification__type,
    project_id: process.env.partner_platform_notification__project_id,
    private_key_id: process.env.partner_platform_notification__private_key_id,
    private_key: private_key.replace(/\\n/g, '\n'),
    client_email: process.env.partner_platform_notification__client_email,
    client_id: process.env.partner_platform_notification__client_id,
    auth_uri: process.env.partner_platform_notification__auth_uri,
    token_uri: process.env.partner_platform_notification__token_uri,
    auth_provider_x509_cert_url: process.env.partner_platform_notification__auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.partner_platform_notification__client_x509_cert_url,
    database_url: process.env.partner_platform_notification__database_url,
}




