# Contributing

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it is:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Improving the documentation

We really appreciate any help but also want to keep the core source very lean, so please don't worry if your contribution is not accepted for the core Frui.ts packages - there should always be a contrib package that your code could happily extend.

## We Develop with Github

We use GitHub to host the code, to track issues and feature requests, as well as accept pull requests. So you can report a bug by opening a new issue, it's that easy!

### Before you send Pull Request

We highly appreciate it if you not only report an issue or request a new feature, but also help us with the actual work and submit a pull request. The following steps should guide you through the process:

1.  Contact the contributors via a Github Issue to ensure that the issue or bug should be handled in the proposed way. Send details of your case and explain the details of the proposed solution.
2.  Once you get approval from one of the maintainers, you can start working on your code change.
3.  After your changes are ready, make sure that you covered your case with automated tests and verify that you have limited the number of breaking changes to a bare minimum.
4.  We also highly appreciate any relevant updates to the documentation.
5.  Make sure that your code is compiling, and all automated tests and linters are passing.

### After you have sent Pull Request

1.  Make sure that you applied or answered all the feedback from the maintainers.
2.  We're trying to be as responsive as possible, but if we didn't respond to you, feel free to ping us on the Gitter channel.
3.  Pull requests will be merged when you get approvals from at least 2 of the maintainers (and no rejection from others).

## Set up your work environment

You need Node.js and Yarn installed locally and run

```
yarn install
```

You can then check the environment with `yarn validate`, and if there are no errors, you should be good to go. You are now ready to contribute!

## Working with the Git

1.  Fork the repository.
2.  Create a feature branch from the master branch.
3.  We're not squashing the changes and using a rebase strategy for our branches (see more in Git documentation). Having that, we highly recommend using clear commit messages. Commits should also represent the unit of change.
4.  Before sending PR to make sure that you rebased the latest master branch from the main Frui.ts repository.
5.  When you're ready, create the Pull Request on GitHub

## Code style

The repository comes with ESlint and Prettier configured. Make sure that you run yarn run lint before pushing changes. We also recommend turning automatic formatting on saving to have all the rules applied.

This is open-source software. Consider the people who will read your code, and make it look nice for them. It's sort of like driving a car: Perhaps you love doing donuts when you're alone, but with passengers, the goal is to make the ride as smooth as possible.

## Dependencies

## Licensing and legal rights

By contributing to Frui.ts:

- You agree that your contributions will be licensed under its MIT License.
- You assert that your contribution is your original work.
- You assert that you have the right to assign the copyright for the work.
