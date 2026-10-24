---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
description: ""   # one or two sentences, used in cards, search results and social previews
slug: {{ .File.ContentBaseName }}
tags: []
# cover: cover.jpg   # optional, an image in this page bundle (also becomes the social preview)
# toc: true          # force the table of contents on/off (default: on for long posts)
---
