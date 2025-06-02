# Bulk Import Poems to Sanity

This guide will help you bulk import your poems from your Word document into Sanity CMS.

## Step 1: Prepare Your Text File

1. **Open your `write.docx` file** in Microsoft Word
2. **Select All** (Ctrl+A) and **Copy** (Ctrl+C) all the text
3. **Create a new file** called `poems-data.txt` in the `sanity-studio` folder
4. **Paste the copied text** into this file and save it

## Step 2: Create Sanity API Token

1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project: **"Hanna Poetry Studio"**
3. Click on **"API"** in the sidebar
4. Click on **"Tokens"** tab
5. Click **"Add API Token"**
6. Set these details:
   - **Name**: `Bulk Import Token`
   - **Permissions**: `Editor`
   - **Dataset**: `hanna`
7. **Copy the token** (you won't see it again!)

## Step 3: Update Import Script

1. Open the file `import-poems.mjs`
2. Find this line: `token: 'YOUR_SANITY_TOKEN_HERE',`
3. Replace `YOUR_SANITY_TOKEN_HERE` with your actual token

## Step 4: Install Dependencies

Run this command in the `sanity-studio` folder:

```bash
npm install @sanity/client
```

## Step 5: Run the Import

Run this command:

```bash
node import-poems.mjs
```

## What the Script Does

The script will:
- ✅ Read your `poems-data.txt` file
- ✅ Automatically detect how your poems are separated
- ✅ Try to identify titles vs content
- ✅ Create proper slugs for each poem
- ✅ Import poems in small batches (to avoid overwhelming the API)
- ✅ Show you progress as it works

## Supported Poem Formats

The script can handle various formats:

### Format 1: Double Line Breaks
```
My First Poem
This is the content of my first poem
Line two of the poem

My Second Poem
This is another poem
With multiple lines
```

### Format 2: Numbered Poems
```
1. First Title
Poem content here
More lines

2. Second Title
Another poem
More content
```

### Format 3: ALL CAPS Titles
```
MY FIRST POEM
Content of the poem
Multiple lines here

ANOTHER POEM TITLE
More poem content
```

## After Import

1. Go to your **Sanity Studio**: `http://localhost:3333`
2. Check the **"📝 All Poems"** section
3. Review and edit any poems as needed
4. Add categories, tags, or featured images if desired
5. Publish any drafts

## Troubleshooting

**❌ "File not found"**: Make sure `poems-data.txt` is in the `sanity-studio` folder

**❌ "Token error"**: Double-check your API token is correct and has Editor permissions

**❌ "No poems parsed"**: Your text format might need adjustment. Try separating poems with double line breaks.

**❌ "Import failed"**: Check your internet connection and try again

## Need Help?

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your `poems-data.txt` formatting
3. Make sure your Sanity token has the right permissions
4. Try importing a smaller batch first (edit the `batchSize` variable)

---

**Happy importing! 🎉📚** 