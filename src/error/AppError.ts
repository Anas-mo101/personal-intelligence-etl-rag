class AppError {
  public readonly name: string;
  public readonly statusCode: number;
  public readonly message?: string;

  public readonly title?: string;
  public readonly body?: string;

  constructor(
    statusCode = 400,
    name: string = "INTERNAL_SERVER_ERROR",
    message: string = "Internal server error",
    displayable?: { title:string, body?: string }
  ) {
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
    this.title = displayable?.title;
    this.body = displayable?.body;
  }
}

export default AppError;
