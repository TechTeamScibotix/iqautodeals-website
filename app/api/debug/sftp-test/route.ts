import { NextRequest, NextResponse } from 'next/server';
import SftpClient from 'ssh2-sftp-client';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

// Debug endpoint to test SFTP connectivity
// Protected by admin secret
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: {},
    dnsTest: {},
    sftpTest: {},
  };

  // 1. Check environment variables (mask passwords)
  results.environment = {
    DEALERSOCKET_SFTP_HOST: process.env.DEALERSOCKET_SFTP_HOST || '(not set)',
    DEALERSOCKET_SFTP_PORT: process.env.DEALERSOCKET_SFTP_PORT || '(not set)',
    DEALERSOCKET_SFTP_USERNAME: process.env.DEALERSOCKET_SFTP_USERNAME ? '(set)' : '(not set)',
    DEALERSOCKET_SFTP_PASSWORD: process.env.DEALERSOCKET_SFTP_PASSWORD ? '(set)' : '(not set)',
    LEXUS_SFTP_USERNAME: process.env.LEXUS_SFTP_USERNAME ? '(set)' : '(not set)',
    LEXUS_SFTP_PASSWORD: process.env.LEXUS_SFTP_PASSWORD ? '(set)' : '(not set)',
  };

  const host = process.env.DEALERSOCKET_SFTP_HOST || '';

  // 2. Test DNS/IP resolution
  try {
    if (host) {
      // Check if it's an IP address or hostname
      const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
      results.dnsTest.isIPAddress = isIP;
      results.dnsTest.host = host;

      if (!isIP) {
        // Try to resolve hostname
        const resolved = await lookup(host);
        results.dnsTest.resolved = resolved;
      } else {
        results.dnsTest.message = 'Host is an IP address, no DNS lookup needed';
      }
      results.dnsTest.success = true;
    } else {
      results.dnsTest.error = 'DEALERSOCKET_SFTP_HOST is not set';
      results.dnsTest.success = false;
    }
  } catch (err: any) {
    results.dnsTest.error = err.message;
    results.dnsTest.success = false;
  }

  // 3. Test SFTP connection
  const sftp = new SftpClient();
  try {
    const port = parseInt(process.env.DEALERSOCKET_SFTP_PORT || '22', 10);
    const username = process.env.LEXUS_SFTP_USERNAME || '';
    const password = process.env.LEXUS_SFTP_PASSWORD || '';

    results.sftpTest.attemptingConnection = {
      host,
      port,
      username: username ? '(set)' : '(not set)',
    };

    await sftp.connect({
      host,
      port,
      username,
      password,
      readyTimeout: 10000, // 10 second timeout
      algorithms: {
        kex: [
          'ecdh-sha2-nistp256',
          'ecdh-sha2-nistp384',
          'ecdh-sha2-nistp521',
          'diffie-hellman-group-exchange-sha256',
          'diffie-hellman-group14-sha256',
        ] as any,
        serverHostKey: [
          'ssh-ed25519',
          'ecdsa-sha2-nistp256',
          'rsa-sha2-512',
          'rsa-sha2-256',
        ] as any,
      },
    });

    // If connected, try to list a directory
    const listing = await sftp.list('/home');
    results.sftpTest.connected = true;
    results.sftpTest.directories = listing.filter((f: any) => f.type === 'd').map((f: any) => f.name);
    results.sftpTest.success = true;

  } catch (err: any) {
    results.sftpTest.connected = false;
    results.sftpTest.error = err.message;
    results.sftpTest.errorCode = err.code;
    results.sftpTest.success = false;
  } finally {
    try {
      await sftp.end();
    } catch {
      // Ignore cleanup errors
    }
  }

  return NextResponse.json(results);
}
