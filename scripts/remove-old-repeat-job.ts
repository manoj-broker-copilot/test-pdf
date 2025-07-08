import { Queue } from 'bullmq';

async function removeOldRepeatableJob() {
  const queueName = 'external-api';

  const queue = new Queue(queueName, {
    connection: {
      host: process.env.REDIS_HOST, // 🔁 your production Redis host
      port: 6380, // 🔁 your Redis port
      password: process.env.REDIS_PASSWORD, // 🔐 your Redis password
      tls: {
        rejectUnauthorized: false, // 👈 required if using AWS/Heroku TLS
      },
    },
  });

  const repeatJobs = await queue.getRepeatableJobs();

  console.log('Repeatable jobs found:\n', repeatJobs);

  for (const job of repeatJobs) {
    if (job.name === 'refresh_token' && job.pattern === '* * 1 * * *') {
      console.log(`Removing old job with pattern ${job.pattern}...`);
      await queue.removeRepeatableByKey(job.key);
      console.log('Old job removed.');
    }
  }

  await queue.close();
}

async function removeAqiSlackJob() {
  const queueName = 'aqi-slack';

  const queue = new Queue(queueName, {
    connection: {
      host: process.env.REDIS_HOST, // 🔁 your production Redis host
      port: 6380, // 🔁 your Redis port
      password: process.env.REDIS_PASSWORD, // 🔐 your Redis password
      tls: {
        rejectUnauthorized: false, // 👈 required if using AWS/Heroku TLS
      },
    },
  });

  const repeatJobs = await queue.getRepeatableJobs();

  console.log('Repeatable jobs found:\n', repeatJobs);

  for (const job of repeatJobs) {
    if (job.name === 'aqi' && job.pattern === '0 55 12 * * *') {
      console.log(`Removing old job with pattern ${job.pattern}...`);
      await queue.removeRepeatableByKey(job.key);
      console.log('Old job removed.');
    }
  }

  await queue.close();
}

removeOldRepeatableJob()
  .then(() => console.log('Cleanup complete.'))
  .catch((err) => console.error('Error cleaning up jobs:', err));

removeAqiSlackJob()
  .then(() => console.log('Cleanup complete.'))
  .catch((err) => console.error('Error cleaning up jobs:', err));
