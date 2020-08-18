# webpack-tl-loader
> ( short for webpack-templating-language-loader )  
> Nunjucks templating language pre-processor for your bundle.

## What it allows you to do
> This loader runs nunjucks over your files before it gets written
> to the bundle.
> Nunjucks is a templating language very similar to Jinja2.
```jinja
<div class="columns is-mobile is-multiline">
    {% for skill in skills %}
        {% for k, v in skill %}
            <div class="column is-6-mobile is-2-desktop is-4-tablet">
                <div class="card">
                    <div class="card-content">
                        <section class='mb-4'>
                            <h2>{{ k }}</h2>
                        </section>
                        <section>
                            <progress class="progress is-medium" value="{{ v }}" max="100">{{ v }}%</progress>
                        </section>
                    </div>
                </div>
            </div>
        {% endfor %}
    {% endfor %}
</div>
```

## Install
> To install this loader, first run:
```bash
npm install -D webpack-tl-loader
```
> And then edit your webpack config and add the following:
```typescript
const config: webpack.Configuration = {

    ...

    module: {
        rules: [

            ...

            {
                test: /\.html$/,
                use: ["html-loader", "webpack-tl-loader"],
            },
        ]
    },
};
```
> And now you are ready to start templating!
