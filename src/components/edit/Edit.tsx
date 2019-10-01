import React from 'react';
import Form from "react-jsonschema-form";
import './edit.css';
import { JSONSchema6 } from 'json-schema';

const schema: JSONSchema6 = {
  title: "Todo",
  type: "object",
  required: ["title"],
  properties: {
    title: {type: "string", title: "Title", default: "A new task"},
    done: {type: "boolean", title: "Done?", default: false}
  }
};

const Edit: React.FC = () => {
  return (
    <section className="container">
      <Form schema={schema}></Form>
    </section>
  );
}

export default Edit;
