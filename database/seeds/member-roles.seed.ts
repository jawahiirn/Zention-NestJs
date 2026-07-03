import dataSource from '../data-source';

async function seed() {
  const ds = await dataSource.initialize();
  const repo = ds.getRepository('ConfigEntity');

  const existing = await repo.findOne({ where: { key: 'member-roles' } });
  if (existing) {
    console.log('Seed already exists, skipping.');
    await ds.destroy();
    return;
  }

  await repo.save({
    key: 'member-roles',
    config: {
      roles: [
        { role: 'OWNER', title: 'Owner', description: 'Full access to all workspace settings and content.' },
        { role: 'ADMIN', title: 'Admin', description: 'Can manage Spaces, People, Billing and other Workspace settings.' },
        { role: 'MEMBER', title: 'Member', description: 'Can access all public items in your Workspace.' },
        { role: 'GUEST', title: 'Guest', description: "Can't use all features or be added to Spaces. Can only access items shared with them." },
      ],
    },
  });

  console.log('Member roles seeded successfully.');
  await ds.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
