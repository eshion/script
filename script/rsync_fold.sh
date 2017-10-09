#!/bin/sh

rsync -rutv $1 $2
rsync -rutv --inplace $2 $1

