class Parser {

  constructor(template) {
    this.template = template;
    this.sections = [];
    this._cursor = 0;
    this._startIndex = 0;
    this._isLiteralMode = true;
    this._parse();
  }
  toComputedPropertyString() {
    return `Ember.computed(${this._getKeyArguments()}function() { ${this._getReturnStatement()} })`;
  }

  _parse() {
    for(this._cursor =0; this._cursor < this.template.length; this._cursor++ ) {
      if(this._isLiteralModeAndStartOfProperty()) {
          this._pushLiteralFromRange();
          this._isLiteralMode = false;
          this._cursor+=1;
          this._startIndex = this._cursor+1;
      } else {
        if(this._isPropertyModeAndEndOfProperty()) {
          this._pushPropertyFromRange();
          this._startIndex = this._cursor+1;
          this._isLiteralMode = true;
        }
      }
    }

    let trailingText = this._getRangeText();
    if(trailingText.length > 0) {
      this.sections.push(new LiteralSection(trailingText));
    }

    if(this._propertySections().length === 0) {
      throw "Templates must contain a dynamic sections";
    }

  }

  _isLiteralModeAndStartOfProperty() {
    return this._isLiteralMode && this.template.charAt(this._cursor) === '$' && this.template.charAt(this._cursor+1) === '{';
  }

  _isPropertyModeAndEndOfProperty() {
    return !this._isLiteralMode && this.template.charAt(this._cursor) === '}';
  }

  _getRangeText() {
    return this.template.substr(this._startIndex, this._cursor-this._startIndex);
  }

  _pushLiteralFromRange() {
    let literalText = this._getRangeText();
    if(literalText.length > 0) {
      this.sections.push(new LiteralSection(literalText));
    }
  }

  _pushPropertyFromRange() {
    let propertyName = this._getRangeText();
    this.sections.push(new PropertySection(propertyName));
  }

  _propertySections() {
    return this.sections.filter(section => {
      return section instanceof PropertySection;
    });
  }

  _literalSections() {
    return this.sections.filter(section => {
      return section instanceof LiteralSection;
    });
  }

  _getKeyArguments() {
    let suffix = "";
    let propertySections = this._propertySections();
    if(propertySections.length > 0) {
      suffix = ", ";
    }
    return propertySections.map((propertySection) => {
      return `"${propertySection.identifier}"`;
    }).join(', ') + suffix;
  }

  _getReturnStatement() {
    let body = this.sections.map((section) => {
      return section.toJavaScript();
    }).join(' + ');
    return `return ${body};`;
  }


}

class LiteralSection {
  constructor(value) {
    this.value = value;
  }

  toJavaScript() {
    let escaped = this.value.replace('"', '\\"');
    return `"${escaped}"`;
  }
}

class PropertySection {
  constructor(identifier) {
    this.identifier = identifier;
  }

  toJavaScript() {
    return `this.get("${this.identifier}")`;
  }

}

module.exports = Parser;
