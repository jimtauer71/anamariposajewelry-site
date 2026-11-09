# Ana Mariposa Jewelry website

The website for anamariposajewelry.com.

- **Files:** a private GitHub repository. Pages CMS saves Ana's changes here.
- **Hosting:** Netlify. It republishes the site automatically each time the repository changes.
- **Admin screen for Ana:** Pages CMS at https://app.pagescms.org (free). Ana signs in with her email and can add, edit, reorder or remove jewelry pieces.
- **Contact form:** Web3Forms. The access key is at the top of `site.js`.

## How the pieces work

Every piece of jewelry is one entry in `content/pieces.json`, with a name, a category, an optional description and a photo. Each gallery page shows the pieces in its category, in list order:

| Category in the admin screen | Page |
| --- | --- |
| Gemstone Jewelry - Necklaces / Bracelets / Earrings | stone-jewelry.html |
| Seed Bead Jewelry | seed-bead-jewelry.html |
| Custom Designs | custom-designs.html |
| Re-Design (Remade & Refreshed) | re-design.html |

Photos live in `images/pieces/`. Each time Netlify publishes, large phone photos are shrunk for the live site (`scripts/optimize_images.py`, run from `netlify.toml`). The originals stay in the repository.

The home page, About Me, Contact and Stone & Care Guide pages are regular HTML files. Changes to those still go through Jim (or Claude).

## One-time setup (Jim)

### 1. Put the files on GitHub
1. On GitHub, create a new **private** repository, for example `anamariposajewelry-site`, with no README.
2. Upload everything in this folder to it, including the `.pages.yml` file. Either give Claude the repository name to push it, or use **Add file > Upload files** and drag in the folder's contents.

### 2. Publish it with Netlify
1. In Netlify, choose **Add new site > Import an existing project > GitHub**, and pick the repository. If Netlify can't see it, use the link it shows to give Netlify access to that repository.
2. Netlify reads `netlify.toml`, so the build settings fill themselves in. Click **Deploy**.
3. After a minute or two the site is live at a `something.netlify.app` address. Give it a friendlier name under **Site configuration > Change site name** if you like.

### 3. Connect anamariposajewelry.com
1. In the Netlify site, open **Domain management > Add a domain**, and enter `anamariposajewelry.com`.
2. Netlify shows the DNS records to add. Add them in Squarespace (account.squarespace.com/domains > the domain > DNS settings), replacing the existing website records for `@` and `www`. **Leave any MX (email) records alone.** They keep Ana's email working.
3. DNS changes can take up to a day. Netlify turns on HTTPS automatically once the domain connects.

### 4. Set up the admin screen for Ana (Pages CMS)
1. Go to https://app.pagescms.org and **Sign in with GitHub**.
2. When prompted, install the Pages CMS GitHub app. Choose **Only select repositories** and pick this repository.
3. Open the repository in Pages CMS. You should see **Jewelry pieces** in the sidebar. Open it to check that the pieces are listed.
4. Invite Ana as a collaborator by email (ana@anamariposajewelry.com). She'll get an email to sign in. She doesn't need a GitHub account.

### 5. Contact form
The Web3Forms access key is already in `site.js`. After the site is live, send a test message from the Contact page. To change where messages go, use the Web3Forms dashboard. The key stays the same.

## Good to know
- After Ana saves, changes appear on the site in about 1-2 minutes. Progress shows in Netlify under **Deploys**.
- Removing a piece from the list hides it from the site but keeps its photo in `images/pieces/`. Photos can be deleted from the Media section of Pages CMS.
- Photos should be JPEG, PNG or WebP. iPhone photos in HEIC format need to be exported as JPEG first. Most phones do this automatically when you email or share a photo.
