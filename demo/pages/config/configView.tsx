import FormField from "@demo/controls/formField";
import { TextBox } from "@src/controls/textBox";
import * as React from "react";
import ConfigViewModel from "./configViewModel";

const ConfigView: React.FunctionComponent<{ vm: ConfigViewModel }> = ({ vm }) => (
    <div className="form-row mt-2">
        <div className="col">
            <FormField label="Redmine url" target={vm.configuration} property="url" component={TextBox} controlId="apiurl" />
        </div>
        <div className="col">
            <FormField label="Redmine access token" target={vm.configuration} property="accessToken" component={TextBox} controlId="apitoken" />
        </div>
    </div>
);

export default ConfigView;
