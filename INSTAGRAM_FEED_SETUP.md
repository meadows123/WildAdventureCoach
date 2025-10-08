# Instagram Feed Integration Guide

## 🎯 Goal
Display the latest posts from [@wildadventurecoach](https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D) on your website.

## 📋 Best Solutions (Ranked by Ease)

### Option 1: Behold Widget (Recommended - Free & Easy) ⭐

**Pros:** Free, easy setup, automatically updates, looks great
**Cons:** Shows "Powered by Behold" watermark on free plan

**Setup Steps:**
1. Go to [https://behold.so](https://behold.so)
2. Sign up for a free account
3. Connect your Instagram account (@wildadventurecoach)
4. Customize the feed design (grid, carousel, etc.)
5. Copy the embed code
6. Replace the iframe in `HomePage.jsx` with the Behold code

**Example code they'll give you:**
```html
<div data-behold-id="YOUR_FEED_ID"></div>
<script src="https://w.behold.so/widget.js" type="module"></script>
```

---

### Option 2: SnapWidget (Free Trial, Then Paid)

**Pros:** Professional, highly customizable, auto-updates
**Cons:** Requires paid subscription after trial (~$5-10/month)

**Setup:**
1. Visit [https://snapwidget.com](https://snapwidget.com)
2. Create a free account
3. Choose "Instagram Grid" or "Instagram Slideshow"
4. Connect @wildadventurecoach
5. Customize appearance
6. Get embed code
7. Add to your website

---

### Option 3: Elfsight Instagram Feed

**Pros:** Beautiful designs, easy to use, responsive
**Cons:** Paid service ($5-20/month depending on plan)

**Setup:**
1. Go to [https://elfsight.com/instagram-feed-instashow/](https://elfsight.com/instagram-feed-instashow/)
2. Sign up and create a widget
3. Enter Instagram username: wildadventurecoach
4. Customize design and layout
5. Get the embed code
6. Install on website

---

### Option 4: Manual Update (Free, Manual Work)

**Pros:** Free, full control, fast loading
**Cons:** Must manually update when new posts are published

**How to do it:**

1. Go to Instagram and open a post you want to feature
2. Right-click on the image → "Open image in new tab"
3. Copy the image URL
4. Update the image URLs in `HomePage.jsx`

**Example:**
```javascript
<img 
  src="PASTE_YOUR_INSTAGRAM_IMAGE_URL_HERE"
  alt="Wild adventure moment"
  className="w-full h-full object-cover"
/>
```

---

### Option 5: Instagram Official Embed (Individual Posts)

**Pros:** Official, reliable, free
**Cons:** Must embed individual posts, not a feed

**How to embed a single post:**

1. Go to an Instagram post on desktop
2. Click the "..." menu (three dots)
3. Select "Embed"
4. Copy the embed code
5. Add to your website

**Example embed code:**
```html
<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/POST_ID/" ...>
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>
```

---

## 🚀 Quick Implementation for Option 1 (Behold)

After you get your Behold embed code, update `HomePage.jsx`:

### Step 1: Get Behold Code
Sign up at [behold.so](https://behold.so) and get your embed code.

### Step 2: Add to HomePage.jsx
Replace the current iframe section with:

```javascript
{/* Instagram Feed - Behold Widget */}
<div className="instagram-feed-container">
  <div data-behold-id="YOUR_BEHOLD_ID_HERE"></div>
</div>
```

### Step 3: Add Script to index.html
Open `/Users/thscholz/Desktop/wild adventure website/index.html` and add before `</body>`:

```html
<script src="https://w.behold.so/widget.js" type="module"></script>
```

---

## 💡 Current Implementation

I've added an iframe placeholder in your HomePage.jsx. This **will not work properly** without one of the above solutions because:

- Instagram blocks direct embedding without proper authentication
- The iframe needs proper credentials and API access
- Third-party widgets handle all the authentication for you

## 🎨 Recommended Next Steps

1. **Quick & Free:** Use Behold.so (takes 5 minutes to set up)
2. **Professional:** Use Elfsight or SnapWidget (paid but polished)
3. **DIY:** Manually update images weekly (free but time-consuming)

## 📞 Need Help?

If you want me to implement any of these solutions, just:
1. Sign up for the service you choose
2. Get the embed code
3. Share it with me, and I'll integrate it properly

The current placeholder will show a link to your Instagram page, so visitors can still find your content! 🎉

