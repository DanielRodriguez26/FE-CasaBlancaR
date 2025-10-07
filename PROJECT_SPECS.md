# My Events - Frontend Specifications

## Project Description

Web application for event management for "My Events" company, enabling efficient administration of events, sessions, and attendees with a modern and responsive interface.

## Technology Stack

- **Framework**: React 18+
- **Router**: React Router DOM v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS / CSS Modules
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite

````
src/
  features/
    authentication/
      Authentication.tsx (container)
      components/
      hooks/
      utils/
    user-profile/
      UserProfile.tsx (container)
      components/
      hooks/
  global/
    components/ (shared by 2+ features)
    hooks/
    utils/

## Epics and User Stories

### Epic 1: Authentication and Authorization

#### US-001: User Registration
**As a** visitor
**I want to** register on the platform
**So that** I can access the application features

**Acceptance Criteria:**
- Form with fields: email, password, confirm password
- Real-time validations:
  - Valid and unique email
  - Password minimum 8 characters, include uppercase, lowercase, and numbers
  - Password confirmation must match
- Show validation errors below each field
- Button disabled until all fields are valid
- Automatic redirect to login after successful registration
- Server error handling

#### US-002: User Login
**As a** registered user
**I want to** log in
**So that** I can access my events and create new ones

**Acceptance Criteria:**
- Form with fields: email and password
- "Remember me" option to maintain session
- Required field validation
- Show error message if incorrect credentials
- Store JWT token in global state and localStorage
- Redirect to dashboard after successful login
- Password recovery link

#### US-003: Route Protection
**As a** system
**I want to** protect routes requiring authentication
**So that** only authenticated users can access them

**Acceptance Criteria:**
- Implement guard/middleware for protected routes
- Redirect to login if no valid token
- Verify token expiration
- Automatic token refresh if about to expire

### Epic 2: Event Management

#### US-004: List Available Events
**As a** user
**I want to** see all available events
**So that** I can know the options and register

**Acceptance Criteria:**
- Grid/List with event cards
- Display: title, date, location, available capacity, image
- Pagination (10 events per page)
- Visual indicator for full events
- Skeleton loading while loading
- Filters by: date, category, status
- Sorting by: date, name, capacity
- Search by name (minimum 3 characters)
- Responsive design for mobile

#### US-005: View Event Detail
**As a** user
**I want to** see complete event information
**So that** I can decide if I want to register

**Acceptance Criteria:**
- Show all event information:
  - Title, full description
  - Date, time, duration
  - Location with integrated map
  - Total and available capacity
  - List of scheduled sessions
  - Speaker information
- Prominent registration button (if spots available)
- Indicator if user is already registered
- Social media sharing
- Countdown if event is upcoming

#### US-006: Create New Event
**As an** authenticated user
**I want to** create new events
**So that** I can organize my activities

**Acceptance Criteria:**
- Multi-step form:
  - Step 1: Basic information (title, description, category)
  - Step 2: Date, time, and location
  - Step 3: Capacity and configuration
  - Step 4: Review and confirmation
- Validations:
  - Title: 5-100 characters
  - Description: 20-500 characters
  - Date must be in the future
  - Capacity: minimum 1, maximum 1000
- Event preview before saving
- Save as draft
- Success notification after creation

#### US-007: Edit Existing Event
**As an** organizer
**I want to** modify events I've created
**So that** I can update information when necessary

**Acceptance Criteria:**
- Only creator can edit their events
- Form prefilled with current data
- Validate no conflicts with registered attendees
- Change history
- Confirmation before saving changes

#### US-008: Advanced Event Search
**As a** user
**I want to** search for specific events
**So that** I can quickly find what interests me

**Acceptance Criteria:**
- Text search in title and description
- Autocomplete with suggestions
- Fuzzy search (error tolerant)
- Show number of results
- Recent search history
- Voice search (optional)

### Epic 3: Session Management

#### US-009: Schedule Event Sessions
**As an** organizer
**I want to** add sessions to my event
**So that** I can structure the agenda

**Acceptance Criteria:**
- Modal/page to add session
- Fields: title, description, speaker, start time, duration
- Validate no time overlaps
- Drag & drop to reorder sessions
- Maximum session limit per event
- Complete agenda preview

#### US-010: Assign Speakers
**As an** organizer
**I want to** assign speakers to sessions
**So that** attendees know the speakers

**Acceptance Criteria:**
- Search existing speakers
- Create new speaker with: name, bio, photo, social media
- One speaker can be in multiple sessions
- Validate schedule availability
- Speaker card with all information

### Epic 4: Attendee Management

#### US-011: Register for Event
**As an** authenticated user
**I want to** register for events
**So that** I can confirm my attendance

**Acceptance Criteria:**
- Registration button visible if spots available
- Confirmation before registering
- Immediate update of spot counter
- Confirmation email (simulated)
- Add to personal calendar
- Option to cancel registration

#### US-012: View My Events
**As a** registered user
**I want to** see events I'm registered for
**So that** I can manage my schedule

**Acceptance Criteria:**
- Personalized dashboard with:
  - Upcoming events (sorted by date)
  - Past events (archive)
  - Events created by me
- Filters by status and date
- Export list to PDF/Excel
- Upcoming event notifications (24h before)
- Quick actions: cancel registration, view detail

#### US-013: Capacity Control
**As a** system
**I want to** control event capacity
**So that** I can avoid overbooking

**Acceptance Criteria:**
- Real-time update of available spots
- Block registration when full
- Waitlist when full
- Notify if spot becomes available
- Occupancy analytics dashboard

### Epic 5: User Profile

#### US-014: View and Edit Profile
**As a** user
**I want to** manage my personal information
**So that** I can keep my data updated

**Acceptance Criteria:**
- Editable information: name, bio, avatar, preferences
- Password change with verification
- Statistics: events attended, created
- Notification settings
- Delete account with confirmation

## Interfaces and Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'admin' | 'organizer' | 'attendee';
  createdAt: Date;
  preferences: UserPreferences;
}
````

### Event

```typescript
interface Event {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: Location;
    capacity: number;
    currentAttendees: number;
    status: "draft" | "published" | "cancelled" | "completed";
    category: string;
    organizer: User;
    sessions: Session[];
    imageUrl?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
```

### Session

```typescript
interface Session {
    id: string;
    eventId: string;
    title: string;
    description: string;
    startTime: Date;
    duration: number; // minutes
    speaker: Speaker;
    room?: string;
    capacity?: number;
}
```

### Registration

```typescript
interface Registration {
    id: string;
    userId: string;
    eventId: string;
    registeredAt: Date;
    status: "confirmed" | "cancelled" | "waitlist";
    attendanceConfirmed: boolean;
}
```