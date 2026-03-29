import sql from 'mssql';

const config: sql.config = {
  server: 'localhost',
  port: 1433,
  database: 'CNWVUD',
  
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: '412005', 
    },
  },
  
  connectionTimeout: 60000,
  requestTimeout: 30000,
  
  options: {
    trustServerCertificate: true,
    encrypt: false,
    enableArithAbort: true,
  },
};

console.log('🔧 Connecting to', config.server + ':' + config.port);

export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('✅ Connected to SQL Server - CNWVUD');
    return pool;
  })
  .catch((err: any) => {
    console.error('❌ Database Connection Error:', err.message);
    console.error('Error code:', err.code);
    throw err;
  });

export default sql;