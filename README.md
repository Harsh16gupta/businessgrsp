🧭 Git Collaboration Procedure for Our Project
1. Clone the repository

If you haven’t already, clone the main project to your local system:

git clone <repo_url>

2. Create your own branch

Before starting any new feature or section, always create a new branch:

git checkout -b feature/<your-feature-name>


Example:

git checkout -b feature/login

3. Work on your part

Do all your coding work (for example, adding your feature or folder) inside your local branch.

Make sure you keep your work separate (different folder or file) from others to avoid merge conflicts.

4. Commit your changes

Once your code is ready, add and commit your changes:

git add .
git commit -m "Added login feature"

5. Push your branch to GitHub

Push your branch to the remote repository:

git push origin feature/<your-feature-name>

6. Create a Pull Request (PR)

Go to GitHub → open your branch → click on “Compare & Pull Request” → describe your changes clearly → submit the PR.

7. Review & Merge

Once the PR is reviewed and approved:

If no conflicts → merge it directly into the main branch.

If conflicts appear → resolve them together before merging.

8. After merge

Everyone should update their local main branch to stay in sync:

git checkout main
git pull origin main

✅ Example:

Kaushal creates and pushes feature/payment

Teammate creates and pushes feature/login

Both submit PRs → both get merged into main
Final result:

/payment
/login


No conflict — both features appear safely in main branch.