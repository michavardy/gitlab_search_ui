import click
import re
from .gitlabClient import GitlabClient
import colorama
from pprint import pprint

class HelpfulCmd(click.Command):
    def format_help(self, ctx, formatter):
        click.clear()
        click.secho("Welcome to search CLI tool", fg="yellow", bold=True, underline=True)
        click.echo()
        click.secho("Description:", fg="cyan")
        click.echo("    This CLI tool helps you search for a given keyword in all of the projects in gitlab.")
        click.echo()
        
        click.secho("Usage:", fg="cyan")
        click.echo("    search <SEARCH_PROMPT> [OPTIONS]")
        click.echo()
        
        click.secho("Options:", fg="cyan")
        click.echo("    -h, --help                              Show this message and exit.")
        click.echo("    --branch <branch-name>                  Specify the branch (default: development).")
        click.echo("    --script_name_black_list <keyword>")
        click.echo("                                            Filter search results by providing a list of script names")
        click.echo("                                            to remove from results (space delimited).")
        click.echo()
        
        click.secho("Example:", fg="cyan")
        click.echo("    search MINIO_PS_FILES_SYNC_BUCKET --branch master --script_name_black_list pscli minio")
        click.echo()


@click.command(cls=HelpfulCmd, context_settings=dict(help_option_names=["-h", "--help"]))
@click.argument('search_prompt')
@click.option('--branch', is_flag=False, default='development', help="Specify branch")
@click.option('--script_name_black_list', is_flag=False, default=None, help="filter search results by providing a list of script names to remove from results, space deliniated")
def search(search_prompt, branch, script_name_black_list):
    """
        Search for a given prompt in the input text.
    """
    # Your command1 logic here
    click.clear()
    click.secho(f"searching: search_prompt: {search_prompt}, branch: {branch}, script_name_black_list: {script_name_black_list}", fg='green', bold=True)
    script_name_black_list = re.split(" ", script_name_black_list)
    glb = GitlabClient()
    search_results = glb.extract_search_results_dict(search_prompt=search_prompt, script_name_black_list=script_name_black_list)
    click.echo(search_results)


if __name__ == '__main__':
    search()
