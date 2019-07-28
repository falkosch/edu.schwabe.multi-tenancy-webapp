# edu.schwabe.webapp-prototypes

![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](<https://lerna.js.org/>)

This project contains a customizable `base-app` and two example tenant clients in `tenants/*` , which showcase how to build a AngularJS, lerna, webpack and SCSS based multi-tenant app. The base-app consists of a landing page, a mock-login and a mock profile view. It is not meant to be a cool super functional demo app. The actual gist of the project is the setup of the tenancy for AngularJS apps.

## How to Use

Set up package with `npm i` .

Generally available package.json scripts are:

* Lint and "auto-fix" all sources of all tenants with `npm run lint` .

* Generate JSDoc of all sources of all tenants into `docs/` with `npm run docs` . You can browse the output with `docs/` with `npm run docs:serve` .

The package.json scripts `*:ci` are actually for the Bitbucket or Jenkins build pipeline, but of course are useful for you as well:

* Build all tenants with `npm run build:ci` .

* Run unit tests of all tenants once with `npm run test:ci` .

* Clean up build temporary resources with `npm run clean:ci` .

## Tenancy

This mono-repo contains a customizable `base-app` and the actual tenant clients in `tenants/*` . The tenant clients depend on the base-app and can extend its functionality by f.e. adding new AngularJS modules, decorate existing AngularJS modules the AngularJS-way and add new ui-router states. Tenants can also add to well defined extension points in the base-app:

* Add entries to the navigation in the side-menubar with `NavigationService.forState` .

* Add access control guard services to the list `StateAccessControlService.guards` .

Furthermore, lerna, webpack and the repo's build scripts manage the bundling of each tenant client independently and enable the following customizations at build time:

* Replace or rather override static assets like images or translation files of the base-app by placing a variant at the same relative path in `tenants/<name of tenant>/src/**/*` as the original is placed in `base-app/src/**/*` . For example, `tenants/tenant1/src/assets/example.jpg` overrides `base-app/src/assets/example.jpg` for only `tenant1` .

* Override base-app's SCSS variables by setting them in `tenants/<name of tenant>/src/scss/shared/_variables.scss` . Note that the base-app follows a component oriented organization: Each AngularJS-module can import its own SCSS root file. To enable the override, `_variables.scss` is hence injected at the beginning of each such SCSS root file during build time. The tenancy in this project is not designed to enable any other manipulation of SCSS or the rendered CSS. Though, `angular-material` still provides a theming system that is worth to mention here, although this project does not make use of it for now.

### How to Use only one Tenant

Start a tenant with `npx lerna run start --stream --scope */<name of tenant>` , f.e. `npx lerna run start --stream --scope */tenant1` or even `npx lerna run start --stream --scope */*1` . The asterisks behave like usual wildcards for lerna's `--scope` . `--stream` is for immediately see the output of the scripts.

Build a tenant into its `dist/` with `npx lerna run build --stream --scope */<name of tenant>` .

Browse a tenant's `dist/` with `npx lerna run build:serve --stream --scope */<name of tenant>` .

Run and watch unit tests of a tenant with `npx lerna run test --stream --scope */<name of tenant>` or `npx lerna run test:debug --stream --scope */<name of tenant>` .

## What to Learn from this Project

The development of this project took me about 2-3 months work time including the Bitbucket and Jenkins pipeline, unit tests, high test coverage, clean build scripts code and clean app code. I am quite happy with the current results and hope it will help others finding a good setup for their tenancy.

I have a lot learning and pain points to share with you here. It is a mix of the experiences learned while working on this project but also from working professionally on a tenancy app. That tenancy app was designed to at first be a non-tenancy app, later was upgraded with tenancy and from that point on was developed in a very hard to understand way and was even more badly maintained. It was also in the progress of upgrading the frontend technology stack, which was hindered due to the bad state is was in. Though, that tenancy app was a great working experience as well.

Here is a summary of what I learned:

* Do not underestimate efforts for developing tenancy.

  * In the worst case, development effort for new features is `<effort for developing a feature in a none-tenancy app> ^ <number of tenants>` if changing parts of the base-app for customizing one tenant also affects other tenants as well, i.e. you not only develop the same thing multiple times but also have to solve inter-tenant anomalous behavior. Sometimes changing something for one tenant breaks it for the other. Experience is key for identifying inter-tenant anomalous behavior, f.e. changing workflows or CSS styles most often cause breaking things in other tenants.
  * If it does not affect other tenants, the actual worst case effort is only `<effort for developing a feature in a none-tenancy app> * <number of tenants>` . That is still an immense impact.

* In the average case, the development effort for new features is `<effort for developing a feature in a none-tenancy app> * log2(<number of tenants> + 1)` , if and only if the setup of the project is clean and conceptionally easy to understand and supports the developers in their daily work tasks, f.e. automating linting, testing, building, releasing and deploying each tenant. The more you ignore efforts for a clean setup and maintaining that clean state, the more the future development effort in the average case will be near the worst case. However, there is always a little development overhead even if required changes are specifically for one tenant only.

* Do not underestimate efforts for writing tests. A good rule of thumb is: Even for simple productive code, writing the test takes 2 to 3 times more additional effort than writing just the productive code. it is not just 20%, 50% or 100% more effort for tests. Training the team in writing tests is key or otherwise the extra effort will even be higher!

* A high test coverage around 80%-100% doesn't naturally mean that your code is perfectly fine. It depends on with what purpose (how or with what mindset) you have developed the tests.

  * Go for the following paradigma: Product requirements determine what tests need to be written. Tests determine what code needs to be written. Then, why the code is can be explained by the tests and why the tests are can be explained by the product requirements. Ideally, when development of a new feature is finished, the tests reflect the product backlog. That way, you have a good documentation of the code at hand that others can use to understand why the app should work exactly that way.
  * It doesn't matter whether you write tests before the productive code, i.e. follow purely TDD. It is also okay to do it afterwards, if writing tests are part of the definition of done and the tests were written with the intend to cover the product requirements. TDD has of course many advantages, but as any other other practice, it is most times not the only viable solution.

    * Do not write tests to just cover your code, because then the meaning of the test coverage is simply just that your code is what it is. That way, when bugs are found due to changed code then usually it won't be due to failing tests. Also such coverage will prevent fast changes for new product requirements, because all or most of the code is required to be exactly the way as it is for the existing tests to not fail.
    * Write tests to cover product requirements, because then the meaning of high test coverage is that the code fits the product requirements well. It also means that not covered code is potentially not necessary and could be deprecated or removed.
    * Unit test coverage is not a perfect measure for compliance with product requirements. Integration tests, system tests or E2E tests provide better measurements. However, unit tests enable localization of irregularities or bugs way easier as they are focusing specifically on single functional units and not the interaction between many different of them.

  * 100% test coverage doesn't mean you have covered all implicit edge cases of the product requirements. Think around the corner to spot hidden bugs, i.e. invest a little bit more time than was necessary to just complete a task. Finding bugs early when you still understand why you have written the code the way as it is will save you time longterm and potentially leave clean code for other developers as well. It avoids potential future relearning time for you or training in time for others for old code.
  * Just going for a high test coverage to satisfy reporting requirements is actually a waste of development resources, although it is perceived as a success to meet reporting requirements.

* Generally there is a debate between what is the best of two kinds of extreme development approaches: One approaches fastest development. The other goes for best quality code. There is actually a balance between the two that is best to daily development. Unfortunately, "fast development" is as ambigous as "best quality code" or at least everyone wants to understand it their way.

  * Fast development means spending development resources economically and competitive. And again, "economically" and "competitive" is still ambigous in that limited focus of my summary.

    * It is sold as short term success. For example, sometimes the development approach to take is dictated by market strategy, i.e. be the first to enter a market with a readily available product, even if it is not in a good quality.
    * It is okay if fast development is planned to happen short term and afterwards the approach changes to improving the quality again. That can even happen in cycles of switching between fast development and improving quality. Intel develops processor architectures in a similar way with a model called Tick-tock. Although that model concerns processor architectures and not code, it is still relatable to the mentioned balance between fast development and best code quality.
    * If fastest development is the only approach taken, than long term (by common development experiences that you can see reported in numerous reference books) it will lead to a conversely ever decreasing development speed until a tipping point is reached. From that tipping point on, the fastest development approach has no advantage over the best quality code approach anymore, i.e. going for always best quality code becomes the faster development approach then.
    * Let's assume that all developers are equally fast in how they execute all required tasks to meet product requirements, then being faster than that basically means to skip tasks. That could be f.e. to not write tests, to postpone solving open issues or to not clean up your first version of new code. So, being the fastest can come at the cost of degrading code quality and future slower development (see numerous reference books).
    * Let's assume that there are multiple solutions to meet product requirements, which each can be implemented in different times, and only the solution that can be implemented fastest is selected. Solutions do not depend on what code is written. They are concepts and rather explain why code was written in a particular way. You can implement solutions with many different kinds of code and still solve the same problem the way it is required, f.e. by splitting an algorithm in small functions or changing execution order of independend work task in the solution. So, selecting a fastest to implement solution has nothing to do with best quality code.

  * Best quality code targets best readability of mistake-free code for the original author of the code or even for a whole team of developers. It basically wants to avoid future overhead caused by f.e. relearning, training in or debugging time needed for understanding old code. It wants to avoid or reduce cognitive-load long term for ever increasing complexity of apps due to progressing future development. Approaching best quality code is therefore desirable but comes at the cost of spending more development time short term.

    * It is less-likely a waste of resources, if there is a compliance or standard of what is understood as best quality code. That can be accomplished by f.e. using tools like linters with fixed team-wide configuration to automatize grading written code. Go for these tools. That is why I am using a lot of these in my project.
    * It also depends on how experienced the developer is with different common development practices like software design patterns or TDD. Training is key. Developers who think they are talented and do not need to educate or train to improve themselfes write (by far) the most incomprehensible code, because they most times do not share the team-wide or community-wide understanding of best quality code.
    * Applying common development practices doesn't mean that it will increase code quality. For example, software design patterns are meant to improve readability and extensibility of an application. They are meant to handle the ever increasing complexity. However, applying these patterns not thoughtful can add even more unnecessary complexity. For example, extensibility comes at the cost of increased complexity at first. If some extensibility approach in your code cannot or will not be used as it should, it has no benefit over a non-extensible (often called hard-wired) approach.

  * Finding that balance is even more important in a tenancy app. Suffering from incomprehensible code is contained in `<effort for developing a feature in a none-tenancy app>` . In the worst case, that overhead is multiplied by the number of tenants. You already have added effort for developing the same thing for each tenant. The last thing you want to have is incomprehensible code in n-times different versions.

    * Do not go for fast solutions, which developers can only hardly use or applicate or cause a lot new complex problems. Go for simple solutions, which actually take off effort of future development.
    * Do not simply put down problems by saying "we can care for that in the future". Until these problems are solved, you will have extra efforts dealing with such problems. If you cannot find a solution now, commit to a plan to solve it in the near future.
