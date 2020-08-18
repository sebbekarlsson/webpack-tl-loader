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

## Directory structure requirements
> This loader requires you to have a `./data` folder within the
> root directory of your application.
> The reason why is explained further down in this README,
> but in short, *it is for making data accessible to your templating context*.

### Data Context
#### Adding data to the template context
> To be able to access static data in your templates,
> simply put `.json` files in the `./data` folder.  
> Here is an example (`./data/skills.json`):
```json
[
    {"python": 95 },
    {"javascript": 79 },
    {"C": 80},
    {"C++": 79},
    {"PHP": 89},
    {"Typescript": 79},
    {"Bash": 79},
    {"SQL": 60},
    {"CSS": 81},
    {"HTML": 90},
    {"SCSS": 82},
    {"Java": 60},
    {"React.js": 70},
    {"Vue.js": 50},
    {"Flask": 90},
    {"MongoDB": 69},
    {"Flutter": 40},
    {"React Native": 39},
    {"OpenGL": 60},
    {"Linux": 87},
    {"Kubernetes": 20},
    {"Elastic Search": 25},
    {"Firebase": 59},
    {"Wordpress": 86}
]
```
> The loader will automatically make this data available in a global
> `skills` variable.
> It automatically names the variable exactly the same as the filename
> but without the `.json` extension.

### Piping your data
> You can also pipe your data through a function.
> I call this function `modifier`. Simply put a file in your `./data` folder.  
> ( `./data/modifier.js` )  
> Here is an example:
```javascript
const sortItems = (a, b) => {
    const akeys = Object.keys(a);
    const bkeys = Object.keys(b);
    
    const av = akeys ? a[akeys[0]] : 0;
    const bv = bkeys ? b[bkeys[0]] : 0;

    return bv - av;
}


module.exports = (data) => Object.assign(
    data,
    {
        "skills": data.skills.sort(sortItems),
    }
)
```
> This example will sort the skills by their value.

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
