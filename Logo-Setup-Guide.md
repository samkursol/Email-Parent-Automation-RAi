# 🎨 RaiCRUITED Logo Setup Guide

## ✅ **What's Already Done:**
- Added logo support to email templates
- Added `RAICRUITED_LOGO_URL` environment variable
- Both fallback HTML and SendGrid templates will show logo

## 🔧 **Next Steps:**

### **Step 1: Host Your Logo Online**

You need to upload your RaiCRUITED logo to a public URL. Options:

#### **Option A: Use Your Website (Recommended)**
1. Upload logo to your website: `https://raicruited.com/logo.png`
2. Make sure it's publicly accessible
3. Recommended size: 200px wide x 60px high (or similar ratio)

#### **Option B: Use Cloud Storage**
- **Cloudinary**: Free tier, easy to use
- **AWS S3**: Professional option
- **GitHub**: Simple for static files

#### **Option C: Use a Free Image Hosting**
- **Imgur**: Quick and easy
- **ImgBB**: Reliable free option

### **Step 2: Update Environment Variable**

Once you have your logo URL, update `.env.local`:

```env
# Replace with your actual logo URL
RAICRUITED_LOGO_URL=https://raicruited.com/assets/logo.png
```

### **Step 3: Update SendGrid Templates**

#### **For Acceptance Template:**
1. Go to SendGrid Dashboard → Email API → Templates
2. Edit your acceptance template (`d-e6b1afbc618a457fbba38ebd9843af85`)
3. Add this HTML at the top:

```html
<div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #e9ecef;">
  <img src="{{logo_url}}" alt="{{platform_name}}" style="height: 60px; max-width: 200px;" />
</div>
```

4. Add `logo_url` to your dynamic template data in the email service

#### **For Welcome Template (when you create it):**
Use the same logo HTML structure for consistency.

### **Step 4: Update Email Service Dynamic Data**

The email services need to include the logo URL in template data:

```javascript
dynamicTemplateData: {
  student_name: studentName,
  guardian_email: guardianEmail,
  platform_name: this.fromName,
  logo_url: process.env.RAICRUITED_LOGO_URL,
  // ... other variables
}
```

### **Step 5: Test Logo Display**

After updating the environment variable, test with:

```bash
# Test welcome email with logo
SEND_TEST_EMAIL=true node test-welcome-email.js
```

## 🎨 **Logo Specifications:**

### **Recommended Dimensions:**
- **Width**: 200px max
- **Height**: 60px max  
- **Format**: PNG (with transparency) or JPG
- **File size**: Under 100KB for fast loading

### **Design Tips:**
- Use high contrast for email readability
- Ensure logo looks good on both light and dark backgrounds
- Test how it appears on mobile devices

## 📧 **Email Template Structure:**

```html
<!-- Logo Header -->
<div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #e9ecef;">
  <img src="{{logo_url}}" alt="RaiCRUITED" style="height: 60px; max-width: 200px;" />
</div>

<!-- Email Content -->
<h1 style="color: #2563eb;">🚀 Welcome to RaiCRUITED!</h1>
<!-- Rest of email content -->
```

## 🔄 **Testing Checklist:**

- [ ] Logo displays correctly in Gmail
- [ ] Logo displays correctly in Outlook  
- [ ] Logo looks good on mobile
- [ ] Logo loads quickly (under 2 seconds)
- [ ] Fallback text shows if image fails to load
- [ ] Logo appears in both HTML and SendGrid templates

---

**Need help?** Upload your logo file and I'll help you get the URL set up!