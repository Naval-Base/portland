workflow "Commit" {
	on = "push"
	resolves = ["ESLint"]
}

action "ESLint" {
	uses = "./action/eslint/",
	secrets = ["GITHUB_TOKEN"]
}
