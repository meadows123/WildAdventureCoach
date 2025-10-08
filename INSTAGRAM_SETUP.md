# 📸 Instagram Feed Setup - Show Live Posts

Display real Instagram photos from [@wildadventurecoach](https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D) on your website!

---

## ⭐ Method 1: Behold Widget (Recommended - FREE & Easy)

### Takes 5 minutes, automatically updates with new posts!

#### Step 1: Sign Up
1. Go to **[https://behold.so](https://behold.so)**
2. Click "Get Started Free"
3. Sign up with your email

#### Step 2: Connect Instagram
1. Click "New Feed"
2. Select "Instagram"  
3. **Important**: Log in with the Instagram account for @wildadventurecoach
4. Grant permissions

#### Step 3: Customize Feed
1. Choose layout: **Grid** (recommended)
2. Number of posts: **8-12**
3. Customize colors:
   - Background: `#F5F1E6` (Warm Linen)
   - Text: `#3E5C4B` (Deep Forest)
   - Accent: `#C67B5C` (Clay Orange)

#### Step 4: Get Your Behold ID
1. Go to "Embed" tab
2. Copy your Behold ID (looks like: `abc123xyz456`)
3. Or copy the full embed code:
```html
<div data-behold-id="YOUR_ID_HERE"></div>
```

#### Step 5: Add to Your Website

**A. Update HomePage.jsx:**
1. Open `src/pages/HomePage.jsx`
2. Find line 175: `data-behold-id="REPLACE_WITH_YOUR_BEHOLD_ID"`
3. Replace with your actual ID:
```jsx
data-behold-id="abc123xyz456"  // Your actual ID
```

**B. Activate Widget Script:**
1. Open `index.html`
2. Find line 16: `<!-- <script src="https://w.behold.so/widget.js" type="module"></script> -->`
3. Remove the `<!--` and `-->` to uncomment:
```html
<script src="https://w.behold.so/widget.js" type="module"></script>
```

#### Step 6: See It Live!
1. Save both files
2. Refresh your browser (`Cmd+Shift+R` or `Ctrl+Shift+R`)
3. Your Instagram posts will appear! 🎉

**Benefits:**
✅ Auto-updates when you post new content  
✅ Free forever  
✅ Shows "Powered by Behold" watermark (removable on paid plan)  
✅ Responsive design  
✅ Fast loading  

---

## 📱 Method 2: Manual Image Update (Free, No Sign-Up)

If you prefer full control without third-party widgets:

### Get Instagram Image URLs:

1. **Go to Instagram**:
   - Visit [https://www.instagram.com/wildadventurecoach/](https://www.instagram.com/wildadventurecoach/)

2. **For each post you want to feature**:
   - Right-click on the post image
   - Select "Open image in new tab"
   - Copy the URL from the address bar (it will look like `https://instagram.com/.../image.jpg`)

3. **Update HomePage.jsx**:
   - Open `src/pages/HomePage.jsx`
   - Find the image grid section (around lines 200-330)
   - Replace each placeholder `src` URL with your actual Instagram image URL:

```jsx
// Find this:
<img 
  src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=500"
  alt="Wild adventure moment 1"
  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
/>

// Change to:
<img 
  src="YOUR_INSTAGRAM_IMAGE_URL_HERE"
  alt="Wild adventure moment 1"
  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
/>
```

4. **Repeat for all 8 images** (or however many posts you want to display)

**Note**: You'll need to manually update these URLs whenever you want to show new posts.

---

## 🔄 Method 3: Instagram Embed (Individual Posts)

Display specific Instagram posts using Instagram's official embed:

1. **On Instagram**: Go to a post you want to embed
2. Click the **three dots (...)** menu
3. Select **"Embed"**
4. Copy the embed code
5. Paste into your HomePage.jsx where you want it to appear

**Example:**
```jsx
<blockquote 
  className="instagram-media" 
  data-instgrm-permalink="https://www.instagram.com/p/POST_ID/"
  data-instgrm-version="14"
>
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>
```

---

## 🎯 Which Method Should You Choose?

| Feature | Behold Widget | Manual | Instagram Embed |
|---------|--------------|--------|-----------------|
| **Auto-updates** | ✅ Yes | ❌ No | ❌ No |
| **Setup time** | 5 min | 20 min | 10 min/post |
| **Cost** | Free | Free | Free |
| **Maintenance** | None | Weekly | Per post |
| **Best for** | Dynamic feed | Full control | Featured posts |

**🏆 Recommendation**: Use **Behold Widget** for the best experience!

---

## 🆘 Troubleshooting

### Widget not showing?
1. Check that you uncommented the script in `index.html`
2. Verify your Behold ID is correct (no typos)
3. Clear browser cache and hard refresh
4. Wait 30 seconds for widget to load

### Images not updating?
1. Log into Behold dashboard
2. Check connection to Instagram is active
3. Refresh the feed in Behold settings

### Want to change layout?
1. Go to Behold dashboard
2. Edit your feed
3. Changes appear automatically on your site!

---

## 📚 Additional Resources

- **Behold Documentation**: [https://behold.so/docs](https://behold.so/docs)
- **Instagram API Info**: [https://developers.facebook.com/docs/instagram](https://developers.facebook.com/docs/instagram)
- **Your Instagram**: [@wildadventurecoach](https://www.instagram.com/wildadventurecoach/)

---

**Last Updated**: October 8, 2025  
**Your Instagram**: @wildadventurecoach  
**Setup Status**: Ready for widget integration!

🎉 Once set up, your Instagram feed will automatically update with every new post!

