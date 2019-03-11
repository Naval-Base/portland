workflow "Commit" {
	on = "push"
	resolves = ["ESLint"]
}

action "ESLint" {
	uses = "./.github/action/eslint",
	secrets = ["GITHUB_TOKEN"]
}
