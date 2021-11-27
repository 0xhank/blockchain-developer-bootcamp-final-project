### Avoiding Common Attacks

## Proper Use of Require, Assert and Revert
The contract goes through a series of require statements to ensure access is controlled, input data is correctly formatted, and functions cannot be called at the wrong time. Once these requires are complete, the function is open to be completed.

## Use Modifiers Only for Validation 
There is one modifier that just ensures correct game state before executing the function.