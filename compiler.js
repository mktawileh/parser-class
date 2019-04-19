const KEYWORDS = ["for", "if", "else", "true", "false"];
const NUM = /[0-9]/,
  WORD = /[a-z_]/i,
  PUNC = /[\.,;(){}[\]]/,
  SPACE = /[\s]/i,
  OPERTATORS = /[\-+*/=!<>|&]/i;

class Parser {
  TokenStream(input) {
    let inputs = this._InputStream(input);
    let tokens = [];
    let proto = tokens.__proto__;
    let piece = "";

    proto.pos = 0;
    proto.fetch = function() {
      return this[this.pos++] || null;
    };

    proto.__defineGetter__("peek", function() {
      return this[this.pos];
    });

    proto.__defineGetter__("after", function() {
      return this[this.pos + 1] || null;
    });

    proto.__defineGetter__("before", function() {
      return this[this.pos - 1] || null;
    });

    proto.__defineGetter__("end", function() {
      return this.pos == this.length;
    });

    function readWhile(predicate) {
      piece = "";
      while (!inputs.end && predicate(inputs.peek)) {
        piece += inputs.fetch();
      }
      return piece;
    }

    function getString(sign = '"') {
      let string = getBetween(sign);
      return tokens.push({
        type: "STRING",
        value: string,
        column: inputs.col - string.length,
        line: inputs.line
      });
    }

    function getComment(sign = "@") {
      let comment = getBetween(sign);
      return tokens.push({
        type: "COMMENT",
        value: comment,
        column: inputs.col - comment.length,
        line: inputs.line
      });
    }

    function getBetween(sign) {
      let escaped = false,
        str = "";
      inputs.fetch();
      while (!inputs.end) {
        let ch = inputs.fetch();
        if (escaped) {
          str += ch;
          escaped = false;
        } else if (ch == sign) {
          break;
        } else {
          str += ch;
        }
      }
      return str;
    }

    function getNumber() {
      let num = readWhile(function(ch) {
        return (
          NUM.test(ch) ||
          (ch == "." && NUM.test(ch.after) && piece.indexOf(".") < 0)
        );
      });
      return tokens.push({
        type: "NUMBER",
        value: num,
        position: inputs.pos - num.length + 1,
        line: inputs.line
      });
    }

    function getPunc(ch) {
      inputs.fetch();
      return tokens.push({
        type: "PUNC",
        value: ch,
        column: inputs.col,
        line: inputs.line
      });
    }

    function getOperator(ch) {
      inputs.fetch();
      return tokens.push({
        type: "OPERATOR",
        value: ch,
        column: inputs.col,
        line: inputs.line
      });
    }

    function getIdent() {
      let id = readWhile(function(ch) {
        if (WORD.test(ch) || NUM.test(ch)) {
          return true;
        }
      });
      return tokens.push({
        type: "ID",
        value: id,
        column: inputs.col - id.length + 1,
        line: inputs.line
      });
    }

    function skip(ch) {
      while (!inputs.end && inputs.peek != ch) {
        inputs.fetch();
      }
    }

    let error = false;
    let message = "";
    while (!inputs.end) {
      let ch = inputs.peek;
      if (ch == "#") {
        skip("\n");
        continue;
      }
      if (ch == "@") {
        getComment();
        continue;
      }
      if (ch == "'") {
        getString("'");
        continue;
      }
      if (ch == '"') {
        getString();
        continue;
      }
      if (NUM.test(ch)) {
        getNumber();
        continue;
      }
      if (WORD.test(ch)) {
        getIdent();
        continue;
      }
      if (PUNC.test(ch)) {
        getPunc(ch);
        continue;
      }
      if (OPERTATORS.test(ch)) {
        getOperator(ch);
        continue;
      }
      if (SPACE.test(ch)) {
        inputs.fetch();
        continue;
      }
      error = true;
      message =
        "Can't Handle With This Char '" +
        ch +
        "' [" +
        inputs.line +
        ":" +
        (inputs.col + 1) +
        "]";
      console.log(message);
      break;
    }
    if (!error) return tokens;
    else return { error: message };
  }

  _InputStream(input) {
    let p = input.__proto__;
    let self = input.__proto__;
    p.pos = 0;
    p.line = 1;
    p.col = 0;
    p.fetch = function() {
      if (input[self.pos] == "\n") self.line++, (self.col = 0);
      else self.col++;
      return input[self.pos++];
    };
    p.__defineGetter__("after", function() {
      return input[self.pos + 1];
    });
    p.__defineGetter__("before", function() {
      return input[self.pos - 1];
    });
    p.__defineGetter__("peek", function() {
      return input[self.pos];
    });
    p.__defineGetter__("end", function() {
      return self.pos == input.length;
    });
    return input;
  }
}