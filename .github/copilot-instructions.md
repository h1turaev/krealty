# Krealty Project - AI Coding Agent Instructions

## Architecture Overview

**Krealty** is a NestJS monorepo with dual applications:
- `krealty-api` (port 3000): Main GraphQL API server
- `krealty-batch` (port 3001): Background job processor

**Tech Stack**: NestJS + GraphQL (Apollo) + MongoDB (Mongoose) + TypeScript

## Project Structure

```
apps/
  krealty-api/src/
    components/        # Feature modules (member, property, auth, etc.)
    schemas/          # Mongoose models (*.model.ts)
    libs/enums/       # Shared enums with GraphQL registration
    database/         # MongoDB connection module
  krealty-batch/      # Scheduled tasks application
```

## Critical Patterns

### 1. Schema-First Design
- **Mongoose schemas** use plain `Schema` constructor (not decorators):
  ```typescript
  const MemberSchema = new Schema({...}, { timestamps: true, collection: "members" });
  export default MemberSchema;
  ```
- Place in `apps/krealty-api/src/schemas/`
- All schemas export with `export default`

### 2. Enum Registration for GraphQL
Every enum **MUST** be registered for GraphQL:
```typescript
import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
  USER = 'USER',
  AGENT = 'AGENT',
}
registerEnumType(MemberType, { name: 'MemberType' });
```
Location: `apps/krealty-api/src/libs/enums/`

### 3. Module Organization
Each feature follows this structure:
```
components/member/
  member.module.ts    # Providers array: [Resolver, Service]
  member.resolver.ts  # GraphQL queries/mutations
  member.service.ts   # Business logic
```

### 4. Environment Configuration
```bash
# .env (MongoDB Atlas)
PORT_API=3000
PORT_BATCH=3001
MONGO_DEV=mongodb+srv://...
MONGO_PROD=mongodb+srv://...
NODE_ENV=development|production
```

Database module switches connection based on `NODE_ENV`.

## Key Commands

```bash
# Development (with hot reload)
npm run start:dev           # API server
npm run start:dev:batch     # Batch server

# Production
npm run start:prod          # Sets NODE_ENV=production
npm run start:prod:batch

# Generate components
nest g module components/feature --no-spec
nest g resolver components/feature --no-spec
nest g service components/feature --no-spec
```

## Database Conventions

- **Unique indexes** on schema level (see `Follow`, `Like` models)
- **Soft deletes** via `deletedAt` timestamp fields
- **Counters** for denormalized data (e.g., `memberLikes`, `propertyViews`)
- **References** use `Schema.Types.ObjectId` with `ref: 'ModelName'`

## GraphQL Setup

- **Playground enabled** at `http://localhost:3000/graphql`
- **Auto schema generation** (`autoSchemaFile: true`)
- File uploads disabled (`uploads: false`)

## Common Pitfalls

1. **Don't use Mongoose decorators** (@Prop, @Schema from @nestjs/mongoose) - use plain Schema constructor
2. **Always register enums** with `registerEnumType` or GraphQL won't recognize them
3. **Import enums from libs/enums/** not from schema files
4. **Use `cross-env`** for NODE_ENV in scripts (Windows compatibility)

## Testing Entry Points

- GraphQL Playground: `http://localhost:3000/graphql`
- REST fallback: `http://localhost:3000/` (AppController)
- MongoDB connection logs on startup

## Dependencies Note

- Uses Apollo Server v4 (deprecated warnings expected)
- Mongoose v8 with @nestjs/mongoose v10
- GraphQL Playground (legacy but functional)
