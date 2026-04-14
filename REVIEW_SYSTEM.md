# Review System Implementation Guide

## Overview
A complete review system has been added to the MK340 Tour Company website with the following features:

- **Star Ratings**: 1-5 star rating system
- **Comments**: Guests can leave detailed comments/opinions
- **Image Uploads**: Up to 5 images per review (stored on Vercel Blob)
- **Access Control**: Only guests with a valid review code can submit reviews
- **Admin Panel**: Generate review codes for tour packages
- **Display Components**: Show reviews on tour cards and tour detail pages

## Database Schema

### `review_codes` Table
Stores review codes for each tour package.

```sql
CREATE TABLE review_codes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  tour_id TEXT NOT NULL REFERENCES tours(id),
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### `reviews` Table
Stores submitted reviews.

```sql
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  tour_id TEXT NOT NULL REFERENCES tours(id),
  review_code_id TEXT NOT NULL REFERENCES review_codes(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

## API Endpoints

### 1. Get Reviews for a Tour
**Endpoint**: `GET /api/reviews/[tourId]`

Returns all visible reviews for a specific tour with average rating.

**Response**:
```json
{
  "reviews": [
    {
      "id": "review_...",
      "name": "Somchai",
      "email": "somchai@example.com",
      "rating": 5,
      "comment": "Great tour!",
      "images": ["https://..."],
      "created_at": "2024-01-01T..."
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 10
}
```

### 2. Submit a Review
**Endpoint**: `POST /api/reviews/submit`

Submit a new review with optional image uploads.

**Body** (FormData):
```
tourId: string
reviewCode: string (8-character code from email)
name: string
email: string
rating: number (1-5)
comment?: string
images?: File[] (max 5 files)
```

**Response**:
```json
{
  "success": true,
  "reviewId": "review_..."
}
```

### 3. Validate Review Code
**Endpoint**: `POST /api/review-codes/validate`

Check if a review code is valid and hasn't been used.

**Body**:
```json
{
  "code": "ABC12345",
  "tourId": "tour_..."
}
```

**Response**:
```json
{
  "valid": true
}
```

### 4. Generate Review Codes (Admin Only)
**Endpoint**: `POST /api/review-codes/generate`

Generate new review codes for a tour package.

**Headers**: `Authorization: Bearer {ADMIN_TOKEN}`

**Body**:
```json
{
  "tourId": "tour_...",
  "count": 10
}
```

**Response**:
```json
{
  "success": true,
  "generatedCount": 10,
  "codes": ["ABC12345", "DEF67890", ...]
}
```

## Components

### StarRating
Interactive or read-only star rating component.

```tsx
<StarRating 
  value={4} 
  onChange={(rating) => setRating(rating)}
  readOnly={false}
  size="md"
/>
```

Props:
- `value`: Current rating (1-5)
- `onChange?`: Called when rating changes
- `readOnly?`: Show stars without interaction
- `size?`: 'sm' | 'md' | 'lg'

### ReviewForm
Form for submitting reviews with code validation.

```tsx
<ReviewForm 
  tourId="tour_..." 
  onSubmitSuccess={() => refresh()}
/>
```

Features:
- Code validation step
- Name and email fields
- Star rating selector
- Comment textarea
- Image upload (max 5)
- Image preview and removal

### ReviewsList
Display all reviews for a tour.

```tsx
<ReviewsList tourId="tour_..." />
```

Shows:
- Average rating
- Total review count
- All visible reviews
- Star ratings, comments, and images

### ReviewSummary
Compact review summary for tour cards.

```tsx
<ReviewSummary tourId="tour_..." />
```

Shows:
- Average rating stars
- Review count
- Only displays if reviews exist

### AdminReviewCodeGenerator
Generate review codes in the admin panel.

```tsx
<AdminReviewCodeGenerator 
  tourId="tour_..." 
  tourTitle="Tour Name"
/>
```

Features:
- Input for number of codes
- Requires admin token
- Shows generated codes
- Copy all codes button

## Admin Workflow

### Step 1: Generate Review Codes
1. Go to `/admin`
2. Expand a tour package
3. Scroll down to "สร้างรหัสรีวิว" section
4. Enter the number of codes needed (1-100)
5. Click "สร้างรหัส"
6. Enter your ADMIN_TOKEN (from environment variable)
7. Copy the generated codes
8. Send codes to tour participants via email

### Step 2: Tour Participants Review
1. Participants visit the tour detail page `/tour/[id]`
2. Scroll to the reviews section
3. Click "เขียนรีวิว" (Write Review)
4. Enter their review code
5. Fill in name, email, rating, and comment
6. Upload up to 5 images
7. Submit the review

## Setup Instructions

### 1. Environment Variables
Add to your `.env.local`:

```env
ADMIN_TOKEN=your_secure_token_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
DATABASE_URL=your_neon_postgres_url
```

### 2. Database Migration
The database tables are automatically created when the app starts (via `ensureToursSchema()`).

### 3. Generate First Review Codes
```bash
# In your admin panel, generate review codes for testing
# Use the AdminReviewCodeGenerator component
```

## Security Considerations

1. **Admin Token Protection**: Review code generation requires an admin token
2. **Code Reusability**: Each review code can only be used once
3. **Review Visibility**: Admin can hide reviews by setting `visible = false`
4. **Image Upload Limits**: Maximum 5 images per review, stored on Vercel Blob
5. **No Authentication Required**: Reviewers only need a valid code from the admin

## Caching

- Reviews are cached for 60 seconds (`revalidate = 60`)
- Cache is revalidated when new reviews are submitted
- Tour detail pages revalidate review content automatically

## Future Enhancements

1. **Email Notifications**
   - Send review code to tour participants after tour
   - Notify admin of new reviews

2. **Admin Moderation**
   - Approve/reject reviews before publishing
   - Flag inappropriate content

3. **Review Analytics**
   - Average rating trends over time
   - Most common feedback extraction
   - Review count statistics

4. **Advanced Filtering**
   - Filter reviews by rating
   - Search reviews by content
   - Sort by date, rating, etc.

5. **Duplicate Prevention**
   - One review per verified participant
   - Email-based verification

6. **Enhanced Validation**
   - Spam detection
   - Inappropriate content filtering
   - Image moderation

## Testing

### Test Review Code Generation
```javascript
// In browser console at /admin
const token = "your_admin_token";
const response = await fetch("/api/review-codes/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    tourId: "tour_1",
    count: 5
  })
});
console.log(await response.json());
```

### Test Review Code Validation
```javascript
const response = await fetch("/api/review-codes/validate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code: "ABC12345",
    tourId: "tour_1"
  })
});
console.log(await response.json());
```

### Test Review Submission
See the ReviewForm component for the form submission flow.

## Troubleshooting

### "Database tables not created"
- Ensure DATABASE_URL is set correctly
- Check that Neon connection is working
- Restart the development server

### "Admin token not accepted"
- Verify ADMIN_TOKEN is set in environment variables
- Ensure the Authorization header format is correct: `Bearer {token}`

### "Images not uploading"
- Check BLOB_READ_WRITE_TOKEN is set
- Verify Vercel Blob storage is configured
- Ensure file size is reasonable (< 10MB)

### "Reviews not showing"
- Try refreshing the page (after 5 seconds for cache)
- Check that reviews are marked as `visible = true`
- Verify the tour ID matches in the reviews table
