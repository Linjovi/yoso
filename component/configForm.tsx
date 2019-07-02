import * as React from "react";
import { Form, Field } from "react-final-form";
import { AppContext, Box, Color, Text } from "ink";
import TextInput from "./TextInput";
import Error from "./Error";
import * as fs from "fs";
import * as path from "path";
import { readConfig } from "../utils/utils";

const filePath = path.dirname(__dirname); //yoso根目录
var config = readConfig();
const fields = [
  {
    name: "username",
    label: "config your github user name",
    validate: (value: any) => {
      if (!value) {
        return "Required";
      }
    },
    Input: TextInput
  },
  {
    name: "repo",
    label: "config your github repo name",
    validate: (value: any) => {
      if (!value) {
        return "Required";
      }
    },
    Input: TextInput
  },
  {
    name: "branch",
    label: "config your github branch name",
    validate: (value: any) => {
      if (!value) {
        return "Required";
      }
    },
    Input: TextInput
  },
  {
    name: "token",
    label: "config you personal token (not necessary)",
    Input: TextInput
  }
];

/// CliForm
export function ConfigForm() {
  const [activeField, setActiveField] = React.useState(0);
  const [submission, setSubmission] = React.useState(config);
  const [finish, setFinish] = React.useState(false);
  return finish ? (
    <AppContext.Consumer>
      {({ exit }) => {
        setTimeout(exit);
        fs.writeFileSync(
          `${filePath}/yoso/.yosoconfig`,
          JSON.stringify(submission)
        );
        return (
          <Box flexDirection="column" marginTop={1}>
            <Color blue>
              <Text bold>Config Values:</Text>
            </Color>
            <Box>{JSON.stringify(submission, undefined, 2)}</Box>
          </Box>
        );
      }}
    </AppContext.Consumer>
  ) : (
    <Form onSubmit={setSubmission} initialValues={config}>
      {({ handleSubmit, validating }) => (
        <Box flexDirection="column">
          {fields.map(({ name, label, validate, Input }, index) => (
            <Field name={name} key={name} validate={validate}>
              {({ input, meta }) => (
                <Box flexDirection="column">
                  <Box>
                    <Text bold={activeField === index}>{label}: </Text>
                    {activeField === index ? (
                      <Input
                        {...input}
                        onSubmit={() => {
                          if (meta.valid && !validating) {
                            setActiveField(value => value + 1); // go to next field
                            if (activeField === fields.length - 1) {
                              // last field, so submit
                              handleSubmit();
                              setFinish(true);
                            }
                          } else {
                            input.onBlur(); // mark as touched to show error
                          }
                        }}
                      />
                    ) : (
                      input.value && <Text>{input.value}</Text>
                    )}
                  </Box>
                  {meta.error && meta.touched && <Error>{meta.error}</Error>}
                </Box>
              )}
            </Field>
          ))}
        </Box>
      )}
    </Form>
  );
}
