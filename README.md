# Javascript Parser (Tokenizer)

A javascript class for tokenizing input code and generating a stream of tokens.

## Origin Story
This project originated when I was 16 years old and eager to create my own programming language. I started by developing the parser, which successfully tokenized input code into different types of tokens. Although I didn't complete the full compiler, this project was a valuable learning experience that fueled my passion for programming and set me on a path of continuous growth.

## Features

- Tokenizes input code into different types of tokens such as keywords, numbers, strings, identifiers, operators, and punctuation.

## Usage

To use the `Parser` class, follow these steps:

1. Include the `parser.js` file in your project.

```html
<script src="parser.js"></script>
```

2. Create an instance of the `Parser` class.

```javascript
const parser = new Parser();
```

3. Call the `TokenStream` method with the input code as a parameter.

```javascript
const tokens = parser.TokenStream(inputCode);
```

4. Handle the resulting tokens or error message.

```javascript
if (Array.isArray(tokens)) {
  // Tokenization successful
  // Process the tokens
} else {
  // Tokenization failed
  console.error(tokens.error);
}
```

## Examples

An example usage of the `Parser` class is provided in the `example.js` file. It demonstrates how to tokenize input code and display the resulting tokens in an HTML element.

## License

This project is licensed under the [MIT License](LICENSE).