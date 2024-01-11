export default function errorHandle(error: any) {
  const errorMessages = error.issues.map((issue: any) => {
    return {
      path: issue.path[0],
      message: issue.message
    }
  })
  return errorMessages;
}