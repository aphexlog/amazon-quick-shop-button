import { Construct, Duration, Stack, StackProps } from "@aws-cdk/core";
import { LambdaIntegration, MethodLoggingLevel, RestApi } from "@aws-cdk/aws-apigateway";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { Function, Runtime, AssetCode, Code } from "@aws-cdk/aws-lambda";


interface ILambdaApiStackProps extends StackProps {
  functionName: string
}

export class LambdaApiStack extends Stack {
  private restApi: RestApi;
  private lambdaFunction: Function;

  constructor(scope: Construct, id: string, props?: ILambdaApiStackProps) {
    super(scope, id, props);

    this.restApi = new RestApi(this, 'RestApi', {
      deployOptions: {
        stageName: 'beta',
        metricsEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
        dataTraceEnabled: true
      }
    });

    const lambdaPolicy = new PolicyStatement();

    this.lambdaFunction = new Function(this, 'Function', {
      functionName: props?.functionName,
      handler: "handler.handler",
      runtime: Runtime.NODEJS_14_X,
      code: new AssetCode('../src'),
      memorySize: 512,
      timeout: Duration.seconds(30),
      initialPolicy: [lambdaPolicy]
    })
  }
}
