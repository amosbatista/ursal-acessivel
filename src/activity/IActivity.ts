export interface IActivity {
  today: {
    TimelineReadingErrors: number,
    AcessibilityFailedPosts: number,
    PostSendErrors: number,
    LastActivity: string
  },
  allTime: {
      TimelineReadingErrors: number,
      AcessibilityFailedPosts: number,
      PostSendErrors: number,
      StartedAt: string
  }
}