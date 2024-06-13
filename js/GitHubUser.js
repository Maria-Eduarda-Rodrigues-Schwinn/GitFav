export class GitHubUser {
  static async search(userName) {
    const endpoint = `https://api.github.com/users/${userName}`

    const data = await fetch(endpoint)
    const { login, name, public_repos, followers } = await data.json()
    return ({
      login,
      name,
      public_repos,
      followers,
    })
  }
}
