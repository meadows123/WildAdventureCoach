# 📸 Instagram Connection Guide - Wild Adventure Coach

## Overview
This guide will help you connect the real @wildadventurecoach Instagram account to automatically display posts on your website's HomePage.

## Current Setup Analysis
Your HomePage.jsx already has the Instagram integration code in place:
- **Instagram Handle**: @wildadventurecoach
- **Widget Service**: Behold.so (configured)
- **Display**: Live feed + static image grid

---

## 🚀 Method 1: Behold.so (Recommended - Easiest)

### Step 1: Create Behold.so Account
1. Go to [behold.so](https://behold.so)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with your email or Google account

### Step 2: Connect Instagram
1. In Behold dashboard, click **"Add Instagram Feed"**
2. Enter Instagram username: `wildadventurecoach`
3. Click **"Connect"**
4. You'll be redirected to Instagram to authorize the connection
5. **Important**: Use the account that manages @wildadventurecoach

### Step 3: Get Widget Code
1. After connection, you'll get a widget ID
2. Copy the widget ID (should be something like `wildadventurecoach`)

### Step 4: Update HomePage.jsx
The code is already configured! Just verify this line in your HomePage.jsx:

```jsx
<div 
  data-behold-id="wildadventurecoach"  // ← This should match your Instagram username
  className="rounded-lg overflow-hidden"
  style={{ minHeight: '400px' }}
></div>
```

### Step 5: Add Behold Script to HTML
Add this script to your `index.html` (in the `<head>` section):

```html
<script src="https://w.behold.so/widget.js" type="text/javascript" async></script>
```

---

## 🔄 Method 2: Instagram Basic Display API (Advanced)

### Step 1: Create Facebook Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Consumer"** or **"Other"** as app type
4. Fill in app details:
   - **App Name**: Wild Adventure Coach Website
   - **App Contact Email**: wildadventurecoach@gmail.com

### Step 2: Add Instagram Basic Display Product
1. In your app dashboard, click **"+ Add Product"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. Click **"Create New App"** in Instagram Basic Display

### Step 3: Configure Instagram Basic Display
1. **Valid OAuth Redirect URIs**: Add your website URL
   - For development: `http://localhost:3000`
   - For production: `https://wildadventurecoach.onrender.com`
2. **Deauthorize Callback URL**: Same as above
3. **Data Deletion Request URL**: Same as above

### Step 4: Get Instagram User ID
1. Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Select your app
3. Get User Token with these permissions:
   - `instagram_basic`
   - `pages_show_list`
4. Make a GET request to: `https://graph.instagram.com/me/accounts`
5. Find your Instagram account and note the **Instagram User ID**

### Step 5: Get Long-Lived Access Token
1. Exchange short-lived token for long-lived token
2. Use this endpoint:
   ```
   GET https://graph.instagram.com/access_token
   ?grant_type=ig_exchange_token
   &client_secret={app-secret}
   &access_token={short-lived-token}
   ```

### Step 6: Update HomePage.jsx with API Integration
Replace the Behold widget with this code:

```jsx
// Add this state at the top of your component
const [instagramPosts, setInstagramPosts] = useState([]);
const [loading, setLoading] = useState(true);

// Add this useEffect
useEffect(() => {
  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch(`/api/instagram-posts`);
      const data = await response.json();
      setInstagramPosts(data.data || []);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchInstagramPosts();
}, []);

// Replace the Behold widget div with:
{loading ? (
  <div className="flex items-center justify-center h-96">
    <div className="text-[#DCCCA3]">Loading Instagram posts...</div>
  </div>
) : (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {instagramPosts.slice(0, 8).map((post, index) => (
      <a
        key={post.id}
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="aspect-square overflow-hidden rounded-lg relative group"
      >
        <img 
          src={post.media_url}
          alt={post.caption || 'Instagram post'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Instagram className="w-8 h-8 text-white" />
        </div>
      </a>
    ))}
  </div>
)}
```

### Step 7: Create Backend API Endpoint
Add this to your `server/index.js`:

```javascript
// Instagram API endpoint
app.get('/api/instagram-posts', async (req, res) => {
  try {
    const INSTAGRAM_USER_ID = 'YOUR_INSTAGRAM_USER_ID';
    const ACCESS_TOKEN = 'YOUR_LONG_LIVED_ACCESS_TOKEN';
    
    const response = await fetch(
      `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,media_type,media_url,permalink,caption&access_token=${ACCESS_TOKEN}`
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Instagram API error:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
});
```

---

## 🎯 Recommended Approach

**Use Method 1 (Behold.so)** because:
- ✅ Easiest to set up
- ✅ No coding required
- ✅ Automatic updates
- ✅ Free tier available
- ✅ Already configured in your code

---

## 🔧 Troubleshooting

### If Behold.so doesn't work:
1. **Check Instagram account**: Make sure @wildadventurecoach is public
2. **Verify widget ID**: Ensure `data-behold-id="wildadventurecoach"` matches exactly
3. **Check script**: Make sure Behold script is loaded in HTML
4. **Clear cache**: Hard refresh the page (Ctrl+F5)

### If Instagram API doesn't work:
1. **Check permissions**: Ensure all required permissions are granted
2. **Verify tokens**: Make sure access tokens are valid and not expired
3. **Check rate limits**: Instagram API has rate limits
4. **Test endpoints**: Use Facebook Graph API Explorer to test

---

## 📱 Final Steps

1. **Choose your method** (Behold.so recommended)
2. **Follow the steps** for your chosen method
3. **Test the connection** by posting on Instagram
4. **Verify updates** appear on your website
5. **Monitor for 24-48 hours** to ensure automatic updates work

---

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify Instagram account is public
3. Ensure all credentials are correct
4. Test with a simple Instagram post first

The integration should work automatically once properly configured!
