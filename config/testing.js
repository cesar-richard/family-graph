exports.config = {
  environment: 'testing',
  isTesting: true,
  logger: {
    level: 'error'
  },
  common: {
    port: 3653,
    database: {
      database: process.env.MYSQL_DATABASE,
      host: process.env.sqlhost,
      username: process.env.sqluser,
      password: process.env.MYSQL_ROOT_PASSWORD
    },
    cas: {
      is_dev_mode: true,
      dev_mode_user: 'cerichar',
      dev_mode_info: {
        mail: 'cesar.richard@hds.utc.fr',
        displayName: 'Cesar Richard',
        cn: 'Cesar Richard',
        givenName: 'Cesar',
        sn: 'Richard',
        accountProfile: 'utc-pers',
        ou: 'staff',
        successfulAuthenticationHandlers: 'LdapAuthenticationHandler',
        samlAuthenticationStatementAuthMethod: 'urn:oasis:names:tc:SAML:1.0:am:password',
        authenticationMethod: 'LdapAuthenticationHandler',
        authenticationDate: '2018-04-14T15:27:01.939+02:00[Europe/Paris]',
        longTermAuthenticationRequestTokenUsed: 'false'
      }
    }
  }
};
