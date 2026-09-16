export class VideoEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly youtubeUrl: string,
    public readonly youtubeId: string,
    public readonly thumbnailUrl: string | null,
    public readonly price: number,
    public readonly isPublished: boolean,
    public readonly sortOrder: number,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  public get isFree(): boolean {
    return this.price === 0;
  }
}

export class UserVideoPurchaseEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly videoId: string,
    public readonly paymentId: string | null,
    public readonly amountPaid: number,
    public readonly purchasedAt: string
  ) {}
}
