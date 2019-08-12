import * as React from "react";
import { Form, Field } from "react-final-form";
import { AppContext, Box, Color, Text } from "ink";
import TextInput from "./TextInput";
import Error from "./Error";
import * as fs from "fs";
import * as path from "path";
import { readConfig } from "../utils/info";
import SelectInput from "ink-select-input";
import { GithubInfo, GitlabInfo } from "../actions/action.input";

interface FieldConfig {
  name: string;
  label: string;
  validate: any;
  Input: any;
}
const yosoPath = `${process.env.HOME}/.yoso`;
var config = readConfig();
const githubFields = [
  {
    name: "username",
    label: "config your github user name",
    validate: (value: string) => {
      if (!value) {
        return "Required";
      }
    },
    Input: TextInput
  },
  {
    name: "repo",
    label: "config your github repo name",
    validate: (value: string) => {
      if (!value) {
        return "Required";
      }
    },
    Input: TextInput
  },
  {
    name: "branch",
    label: "config your github branch name",
    validate: (value: string) => {
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

const gitlabField = [
  {
    name: "username",
    label: "config your gitlab address",
    validate: (value: string) => {
      if (!value) {
        return "Required";
      }
    },
    Input: TextInput
  },
  {
    name: "repo",
    label: "config your gitlab repo id",
    validate: (value: string) => {
      if (!value) {
        return "Required";
      }
    },
    Input: TextInput
  },
  {
    name: "branch",
    label: "config your gitlab branch name",
    validate: (value: string) => {
      if (!value) {
        return "Required";
      }
    },
    Input: TextInput
  },
  {
    name: "token",
    label: "config you personal token",
    validate: (value: string) => {
      if (!value) {
        return "Required";
      }
    },
    Input: TextInput
  }
];

export function ConfigForm() {
  const [repoSource, setRepoSource] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const [finish, setFinish] = React.useState(false);

  const handleSelect = (item: any) => {
    setRepoSource(item.value);
    setStep(1);
  };

  const items = [
    {
      label: "github",
      value: 0
    },
    {
      label: "gitlab",
      value: 1
    }
  ];

  return finish ? (
    <AppContext.Consumer>
      {({ exit }) => {
        setTimeout(exit);
        config.repoSource = repoSource;
        return <Box />;
      }}
    </AppContext.Consumer>
  ) : step === 0 ? (
    <SelectInput items={items} onSelect={handleSelect} />
  ) : (
    <SettingForm
      repoSource={repoSource}
      fields={repoSource === 0 ? githubFields : gitlabField}
    />
  );
}
/// CliForm
export function SettingForm(props: any) {
  const [activeField, setActiveField] = React.useState(0);
  const [submission, setSubmission] = React.useState(
    props.repoSource === 0 ? config.github : config.gitlab
  );
  const [finish, setFinish] = React.useState(false);
  
  return finish ? (
    <AppContext.Consumer>
      {({ exit }) => {
        setTimeout(exit);
        config.repoSource = props.repoSource;
        switch (props.repoSource) {
          case 0:
            config.github = submission as GithubInfo;
            break;
          case 1:
            config.gitlab = submission as GitlabInfo;
            break;
          default:
            return;
        }
        fs.writeFileSync(
          path.join(yosoPath, ".yosoconfig"),
          JSON.stringify(config)
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
    <Form
      onSubmit={setSubmission}
      initialValues={props.repoSource == 0 ? config.github : config.gitlab}
    >
      {({ handleSubmit, validating }) => (
        <Box flexDirection="column">
          {(props.fields as FieldConfig[]).map(
            ({ name, label, validate, Input }, index) => (
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
                              if (activeField === props.fields.length - 1) {
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
            )
          )}
        </Box>
      )}
    </Form>
  );
}
