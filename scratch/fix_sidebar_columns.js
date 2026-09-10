const mongoose = require('../backend/node_modules/mongoose');
const path = require('path');
require('../backend/node_modules/dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function checkAndFixResumes() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('No MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const resumes = await mongoose.connection.db.collection('resumes').find({}).toArray();
  console.log(`Found ${resumes.length} resumes.`);

  for (const r of resumes) {
    let modified = false;
    const sections = r.data?.sections || {};
    const layout = r.data?.metadata?.layout?.[0] || [];
    const sidebarIds = Array.isArray(layout[1]) ? layout[1] : [];

    console.log(`\nResume: "${r.title}" (ID: ${r._id})`);
    console.log(`Template: ${r.data?.metadata?.template}`);
    console.log(`Sidebar sections:`, sidebarIds);

    // Check all sections, especially skills, languages, interests, or any section in sidebar
    for (const [secKey, sec] of Object.entries(sections)) {
      if (sec && typeof sec === 'object') {
        if (sec.columns > 1) {
          console.log(`  Section "${secKey}" has columns: ${sec.columns}`);
          // If it's in sidebar OR if it's skills/languages/interests, reset to 1
          if (sidebarIds.includes(secKey) || ['skills', 'languages', 'interests'].includes(secKey)) {
            console.log(`  -> Fixing "${secKey}" columns from ${sec.columns} to 1`);
            sec.columns = 1;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      await mongoose.connection.db.collection('resumes').updateOne(
        { _id: r._id },
        { $set: { 'data.sections': sections, updatedAt: new Date() } }
      );
      console.log(`  Successfully updated resume "${r.title}" in DB.`);
    } else {
      console.log(`  No columns > 1 in sidebar needed fixing.`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

checkAndFixResumes().catch((err) => {
  console.error(err);
  process.exit(1);
});
