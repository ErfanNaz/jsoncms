import React, { Component } from 'react';
import Form from "react-jsonschema-form";
import './edit.css';
import { JSONSchema6 } from 'json-schema';

interface EditorState {
  schema: JSONSchema6;
  data: any;
}

const EditView: React.FC<EditorState> = (props) => {
  return (
    <section className="container">
      <Form schema={props.schema}></Form>
    </section>
  );
}

const schema: JSONSchema6 = {
  "type": "object",
  "properties": {
      "name": {
          "type": "string",
          "minLength": 2,
          "description": "Name or alias"
      },
      "sex": {
          "type": "string",
          "enum": [
              "man",
              "woman"
          ]
      },
      "description": {
          "type": "string"
      },
      "birthday": {
          "type": "string",
          "title": "date of your birthday",
          "format": "date"
      },
      "books": {
          "type": "array",
          "title": "written books",
          "items": {
              "type": "object",
              "properties": {
                  "title": {
                      "title": "Title of the Book",
                      "type": "string"
                  },
                  "pages": {
                      "type": "integer",
                      "title": "How many pages the book has"
                  },
                  "datei": {
                      "type": "string",
                      "format": "file"
                  }
              },
              "required": [
                  "title",
                  "pages"
              ]
          }
      }
  },
  "required": [
      "name",
      "sex",
      "bookings"
  ]
};

class Edit extends Component<{}, EditorState> {
  state: EditorState = {
    schema: schema,
    data: {}
  }

  render() {
    return (
      <EditView {...this.state}></EditView>
    );
  }
}

export default Edit;
