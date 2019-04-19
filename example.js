let code = document.getElementById("code");
let result = document.getElementById('result');
let parser = new Parser();

function get_tokens() {
  result.textContent = JSON.stringify(parser.TokenStream(code.value));
}