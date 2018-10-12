# Medium Publisher
**Publish Backdated Posts on Medium**

If you have writings published in other places and want to publish them to medium with their actual publication time, this CLI tool can help you.

## Installation

     $ nvm use
     $ yarn

## Usage

### Get A Medium Token

**Warning:** This token is like your password. Make sure not to share it with anyone. Delete the token after you are done.

### Prepare Your Posts

The CLI tool assumes your posts are in Markdown format with a jekyll header. Here is an example:

```markdown
---
title: Everything is Awesome 
date: 2016-03-17
---
# My header

This is a great post
```
The only required fields are `title` and `date`.

### Run the command

     $ MEDIUM_TOKEN=mytoken node index.js <path/to/markdown/file>


## Credit

Special thanks to [Daniel Da Silva](https://github.com/danielfdsilva) who wrote the [original scripts](https://github.com/developmentseed/medium-migration) that I only edited. 