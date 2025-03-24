🎵 TuneZ Music App - Backend

TuneZ is a music streaming and uploading platform that allows users to enjoy their favorite songs and share their own cover versions. This application is built for learning purposes and is not intended for commercial use.
📌 Features

    🎧 Stream Music – Listen to a collection of songs and covers uploaded by users.
    🎤 Upload Covers – Share your own covers of your favorite tracks with the community.
    📂 Manage Playlists – Create and customize playlists to organize your music.
    🔍 Search & Discover – Find new songs, artists, and trending covers.
    👤 User Authentication – Sign up, log in, and manage your profile.
    💬 Like & Comment – Engage with other users by liking and commenting on their covers.

🛠️ Tech Stack

    Backend: Node.js with Express.js (TypeScript)
    Database & Storage: Firebase Firestore & Firebase Storage
    Authentication: Firebase Authentication
    Hosting: Firebase Functions

📜 Disclaimer

This project is created for educational purposes only. It is not affiliated with or intended to infringe upon any copyrighted material. Users should only upload content that complies with copyright laws.

### Creational Patterns

#### Factory Method
- **Payment Service:** `src/services/payment-service/src/service/PaymentServiceFactory.ts` - Creates payment implementations based on payment method
- **Playlist Service:** `src/services/playlist-service/src/service/generate/factory/PlaylistFactory.ts` - Creates different playlist group types

#### Singleton
- **Music Service:** `src/services/music-service/src/service/MusicBaseMediator.ts` - Implemented as singleton with `@singleton()` decorator
- **Music Service:** `src/services/music-service/src/service/MusicStreamMediator.ts` - Implemented as singleton
- **Music Service:** `src/services/music-service/src/service/MusicUserMediator.ts` - Implemented as singleton

### Structural Patterns

#### Proxy
- **API Gateway Service:** `src/services/api-gateway/src/proxy/CreateProxy.ts` - Routes requests to appropriate microservices
- Handles request forwarding, header modification, and response processing

#### Facade
- **API Gateway Service:** `src/services/api-gateway/src/index.ts` - Acts as a facade for the entire microservice system
- **Service Interfaces:** Each service's interface directory provides simplified facades to complex subsystems

#### Adapter
- **Music Service:** Found in grpc and dto directories - Adapts data between different formats and services
- **User Service:** Found in dto directories - Adapts user data between different formats

### Behavioral Patterns

#### Mediator
- **Music Service:** `src/services/music-service/src/service/MusicBaseMediator.ts` - Coordinates communication between components
- **Music Service:** `src/services/music-service/src/service/MusicStreamMediator.ts` - Handles stream-related communications
- **Music Service:** `src/services/music-service/src/service/MusicUserMediator.ts` - Manages user-related communications

#### Command/CQRS
- **Music Service:** `src/services/music-service/src/service/music_base/command/CreateMusicCommand.ts` - Command implementation
- **Music Service:** `src/services/music-service/src/service/music_base/query/GetAllMusicQuery.ts` - Query implementation
- **Music Service:** `src/services/music-service/src/config/container/MusicBaseService.HandlerRegister.ts` - Command registration

#### Strategy
- **Playlist Service:** `src/services/playlist-service/src/service/generate/strategy/user_group/` - User playlist strategies
- **Playlist Service:** `src/services/playlist-service/src/service/generate/strategy/follow_group/` - Follow-based playlist strategies
- **Playlist Service:** `src/services/playlist-service/src/service/generate/strategy/history_group/` - History-based playlist strategies

#### Observer
- **Payment Service:** Evident in the service workflow handling payment notifications and updates

### Architectural Patterns

#### Microservices
- **Entire Project:** `src/services/` - Contains all independently deployable microservices
- **API Gateway:** `src/services/api-gateway/` - Entry point that routes to appropriate services

#### Repository
- **All Services:** Located in `repository` directories in each service, e.g., `src/services/music-service/src/repository/`
- Abstracts data access from business logic

#### Dependency Injection
- **Music Service:** `src/services/music-service/src/config/container/` - Container configuration
- Uses tsyringe for dependency management throughout services