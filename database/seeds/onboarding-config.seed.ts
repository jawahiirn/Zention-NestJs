import dataSource from '../data-source';

async function seed() {
  const ds = await dataSource.initialize();
  const repo = ds.getRepository('OnboardingConfigEntity');

  const existing = await repo.findOne({ where: { key: 'default' } });
  if (existing) {
    console.log('Seed already exists, skipping.');
    await ds.destroy();
    return;
  }

  await repo.save({
    key: 'default',
    config: {
      steps: [
        {
          id: 'purpose',
          label: 'What purpose do you want to create this workspace for?',
          shortDescription: 'Select the primary use case for this workspace.',
          type: 'select',
          required: true,
          options: [
            { label: 'Work', value: 'work' },
            { label: 'School', value: 'school' },
            { label: 'Personal', value: 'personal' },
          ],
        },
      ],
    },
  });

  console.log('Onboarding config seeded successfully.');
  await ds.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
